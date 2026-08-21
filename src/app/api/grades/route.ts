import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { GradeRecordModel, UserModel, AssessmentTermModel } from '@/server/models';
import { getSessionUser } from '@/server/auth';

function calculateGrade(percentage: number): string {
  if (percentage >= 91) return 'A1';
  if (percentage >= 81) return 'A2';
  if (percentage >= 71) return 'B1';
  if (percentage >= 61) return 'B2';
  if (percentage >= 51) return 'C1';
  if (percentage >= 41) return 'C2';
  if (percentage >= 33) return 'D';
  return 'E (Needs Improvement)';
}

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const grade = searchParams.get('grade');
    const examName = searchParams.get('examName');
    const termCode = searchParams.get('termCode');
    const session = searchParams.get('session');

    await connectToDatabase();

    const query: any = {};
    if (session && session !== 'all') query.session = session;
    if (termCode && termCode !== 'all') query.termCode = termCode.toUpperCase();
    if (examName && examName !== 'all') query.examName = examName;
    if (grade && grade !== 'all') query.grade = grade;

    if (user.role === 'student') {
      query.student = user._id;
      query.published = true;
      const records = await GradeRecordModel.find(query).sort({ session: -1, termCode: 1, createdAt: -1 });
      return NextResponse.json({ success: true, records });
    }

    const records = await GradeRecordModel.find(query).sort({ session: -1, grade: 1, termCode: 1, admissionNo: 1 });
    return NextResponse.json({ success: true, records });
  } catch (error: any) {
    console.error('Grades fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve grade records.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Faculty or Admin credentials required to issue report cards.' }, { status: 403 });
    }

    const {
      admissionNo,
      session = '2026-2027',
      termCode = 'SA1',
      examName,
      subjects,
      facultyRemarks,
      principalRemarks,
      attendancePercentage,
      rankInClass,
    } = await req.json();

    if (!admissionNo || !Array.isArray(subjects) || subjects.length === 0) {
      return NextResponse.json(
        { error: 'Admission number and subjects list are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const studentUser = await UserModel.findOne({ admissionNo, role: 'student' });
    if (!studentUser) {
      return NextResponse.json({ error: 'Student with this admission number not found.' }, { status: 404 });
    }

    const normalizedTermCode = (termCode || 'SA1').toUpperCase().trim();
    const finalExamName =
      examName ||
      (normalizedTermCode === 'FA1'
        ? 'Formative Assessment 1 (FA-1)'
        : normalizedTermCode === 'FA2'
        ? 'Formative Assessment 2 (FA-2)'
        : normalizedTermCode === 'SA1'
        ? 'Summative Assessment 1 (Half-Yearly Examination)'
        : normalizedTermCode === 'FA3'
        ? 'Formative Assessment 3 (FA-3)'
        : normalizedTermCode === 'FA4'
        ? 'Formative Assessment 4 (FA-4 / Pre-Boards)'
        : normalizedTermCode === 'SA2'
        ? 'Summative Assessment 2 (Annual Final Examination)'
        : `${normalizedTermCode} Assessment`);

    let totalMaxMarks = 0;
    let totalMarksObtained = 0;

    const processedSubjects = subjects.map((sub: any) => {
      const maxMarks = Number(sub.maxMarks) || 100;
      const marksObtained = Number(sub.marksObtained) || 0;
      totalMaxMarks += maxMarks;
      totalMarksObtained += marksObtained;
      const subPercentage = maxMarks > 0 ? (marksObtained / maxMarks) * 100 : 0;
      return {
        name: sub.name,
        maxMarks,
        marksObtained,
        grade: calculateGrade(subPercentage),
        remarks: sub.remarks || 'Satisfactory progress',
      };
    });

    const percentage = totalMaxMarks > 0 ? Number(((totalMarksObtained / totalMaxMarks) * 100).toFixed(1)) : 0;
    const overallGrade = calculateGrade(percentage);

    const issuer = user.role === 'admin'
      ? `${user.name} (Admin Office)`
      : `${user.name} (Faculty In-Charge)`;

    const record = await GradeRecordModel.findOneAndUpdate(
      { student: studentUser._id, session, termCode: normalizedTermCode },
      {
        student: studentUser._id,
        admissionNo: studentUser.admissionNo,
        studentName: studentUser.name,
        grade: studentUser.grade,
        section: studentUser.section,
        session,
        academicYear: session,
        termCode: normalizedTermCode,
        examName: finalExamName,
        subjects: processedSubjects,
        totalMaxMarks,
        totalMarksObtained,
        percentage,
        overallGrade,
        attendancePercentage: attendancePercentage || 95,
        rankInClass: rankInClass || 1,
        facultyRemarks: facultyRemarks || 'Continues to show exemplary discipline and dedication.',
        principalRemarks: principalRemarks || 'Promoted with academic commendation.',
        issuedBy: issuer,
        issueDate: new Date().toISOString().split('T')[0],
        published: true,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Report card for ${studentUser.name} (${normalizedTermCode} • Session ${session}) issued successfully.`,
      record,
    });
  } catch (error: any) {
    console.error('Grades save error:', error);
    return NextResponse.json({ error: 'Failed to record grades.' }, { status: 500 });
  }
}
