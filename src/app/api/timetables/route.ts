import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { TimetableModel } from '@/server/models';
import { getSessionUser } from '@/server/auth';

const defaultPeriods = [
  { periodNo: 1, timeSlot: '08:30 - 09:20 AM', subject: 'Mathematics', teacherName: 'Prof. Rajesh Sharma', roomNo: 'Room 101' },
  { periodNo: 2, timeSlot: '09:20 - 10:10 AM', subject: 'Physics & STEM Lab', teacherName: 'Dr. Vikram Malhotra', roomNo: 'Physics Lab A' },
  { periodNo: 3, timeSlot: '10:25 - 11:15 AM', subject: 'Chemistry', teacherName: 'Prof. Ananya Sen', roomNo: 'Chem Lab 2' },
  { periodNo: 4, timeSlot: '11:15 - 12:05 PM', subject: 'English Literature', teacherName: 'Prof. Meenakshi Iyer', roomNo: 'Room 101' },
  { periodNo: 5, timeSlot: '12:45 - 01:30 PM', subject: 'Computer Science & AI', teacherName: 'Prof. Sandeep Verma', roomNo: 'Tinkering Lab' },
  { periodNo: 6, timeSlot: '01:30 - 02:15 PM', subject: 'Physical Education & Sports', teacherName: 'Coach Devendra', roomNo: 'Sports Ground' },
];

const defaultDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get('grade') || 'Grade 10';
    const section = searchParams.get('section') || 'A';
    const day = searchParams.get('day');

    await connectToDatabase();
    const query: any = { grade, section };
    if (day) query.day = day;

    let timetables = await TimetableModel.find(query).sort({ day: 1 });

    // If no timetables exist for this grade/section, auto-seed defaults for week
    if (timetables.length === 0) {
      const initialDocs = defaultDays.map((d) => ({
        grade,
        section,
        day: d,
        periods: defaultPeriods,
      }));
      await TimetableModel.insertMany(initialDocs);
      timetables = await TimetableModel.find(query).sort({ day: 1 });
    }

    return NextResponse.json({ success: true, timetables });
  } catch (error: any) {
    console.error('Timetable fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve timetable schedules.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
      return NextResponse.json({ error: 'Admin or Faculty authorization required to edit timetables.' }, { status: 403 });
    }

    const { grade = 'Grade 10', section = 'A', day, periods } = await req.json();

    if (!day || !Array.isArray(periods)) {
      return NextResponse.json({ error: 'Day and periods array are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const updated = await TimetableModel.findOneAndUpdate(
      { grade, section, day },
      {
        grade,
        section,
        day,
        periods,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Timetable for ${grade}-${section} on ${day} updated successfully.`,
      timetable: updated,
    });
  } catch (error: any) {
    console.error('Timetable update error:', error);
    return NextResponse.json({ error: 'Failed to save timetable changes.' }, { status: 500 });
  }
}
