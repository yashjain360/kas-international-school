import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { AttendanceRecordModel, UserModel } from '@/server/models';
import { getSessionUser } from '@/server/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const grade = searchParams.get('grade') || 'Grade 10';
    const section = searchParams.get('section') || 'A';

    await connectToDatabase();

    if (user.role === 'student') {
      const records = await AttendanceRecordModel.find({ student: user._id }).sort({ date: -1 });
      const totalDays = records.length;
      const presentDays = records.filter((r) => r.status === 'present' || r.status === 'late').length;
      const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

      return NextResponse.json({
        success: true,
        records,
        stats: {
          totalDays,
          presentDays,
          absentDays: records.filter((r) => r.status === 'absent').length,
          percentage,
        },
      });
    }

    // For Faculty and Admin: Return roster with attendance status for specific date & grade
    const students = await UserModel.find({ role: 'student', grade, section, isActive: true }).sort({ admissionNo: 1 });
    const existingRecords = await AttendanceRecordModel.find({ grade, section, date });

    const attendanceMap = new Map();
    existingRecords.forEach((rec) => {
      attendanceMap.set(rec.student.toString(), rec);
    });

    const roster = students.map((st) => {
      const existing = attendanceMap.get(st._id.toString());
      return {
        studentId: st._id.toString(),
        name: st.name,
        admissionNo: st.admissionNo,
        grade: st.grade,
        section: st.section,
        status: existing ? existing.status : 'present',
        remarks: existing?.remarks || '',
      };
    });

    return NextResponse.json({
      success: true,
      date,
      grade,
      section,
      roster,
    });
  } catch (error: any) {
    console.error('Attendance fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve attendance records.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Faculty or Admin credentials required.' }, { status: 403 });
    }

    const { date, grade, section, entries } = await req.json();

    if (!date || !grade || !section || !Array.isArray(entries)) {
      return NextResponse.json({ error: 'Date, grade, section, and student entries are required.' }, { status: 400 });
    }

    await connectToDatabase();

    for (const entry of entries) {
      await AttendanceRecordModel.findOneAndUpdate(
        { student: entry.studentId, date },
        {
          student: entry.studentId,
          admissionNo: entry.admissionNo,
          studentName: entry.name,
          grade,
          section,
          date,
          status: entry.status || 'present',
          remarks: entry.remarks,
          markedBy: `${user.name} (${user.role})`,
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Attendance for ${grade}-${section} on ${date} saved successfully.`,
    });
  } catch (error: any) {
    console.error('Attendance save error:', error);
    return NextResponse.json({ error: 'Failed to record attendance.' }, { status: 500 });
  }
}
