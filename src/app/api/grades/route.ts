import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { GradeRecordModel, UserModel } from '@/server/models';
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

    await connectToDatabase();

    if (user.role === 'student') {
      const records = await GradeRecordModel.find({ student: user._id, published: true }).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, records });
    }

    const query: any = {};
    if (grade && grade !== 'all') query.grade = grade;
    if (examName && examName !== 'all') query.examName = examName;

    const records = await GradeRecordModel.find(query).sort({ grade: 1, admissionNo: 1 });
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
      return NextResponse.json({ error: 'Faculty or Admin credentials required.' }, { status: 403 });
    }

    const { admissionNo, examName, subjects, facultyRemarks, attendancePercentage } = await req.json();

    if (!admissionNo || !examName || !Array.isArray(subjects) || subjects.length === 0) {
      return NextResponse.json({ error: 'Admission number, exam name, and subjects list are required.' }, { status: 400 });
    }

    await connectToDatabase();
    const studentUser = await UserModel.findOne({ admissionNo, role: 'student' });
    if (!studentUser) {
      return NextResponse.json({ error: 'Student with this admission number not found.' }, { status: 404 });
    }

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

    const record = await GradeRecordModel.findOneAndUpdate(
      { student: studentUser._id, examName },
      {
        student: studentUser._id,
        admissionNo: studentUser.admissionNo,
        studentName: studentUser.name,
        grade: studentUser.grade,
        section: studentUser.section,
        examName,
        subjects: processedSubjects,
        totalMaxMarks,
        totalMarksObtained,
        percentage,
        overallGrade,
        attendancePercentage: attendancePercentage || 95,
        facultyRemarks: facultyRemarks || 'Continues to show exemplary discipline and dedication.',
        published: true,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Report card for ${studentUser.name} (${examName}) saved successfully.`,
      record,
    });
  } catch (error: any) {
    console.error('Grades save error:', error);
    return NextResponse.json({ error: 'Failed to record grades.' }, { status: 500 });
  }
}
