import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { TimetableModel } from '@/server/models';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get('grade') || 'Grade 10';
    const section = searchParams.get('section') || 'A';
    const day = searchParams.get('day');

    await connectToDatabase();
    const query: any = { grade, section };
    if (day) query.day = day;

    const timetables = await TimetableModel.find(query).sort({ day: 1 });
    return NextResponse.json({ success: true, timetables });
  } catch (error: any) {
    console.error('Timetable fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve timetable schedules.' }, { status: 500 });
  }
}
