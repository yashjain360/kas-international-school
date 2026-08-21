import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { UserModel, FacultyProfileModel } from '@/server/models';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const facultyUsers = await UserModel.find({ role: 'faculty', isActive: true }).sort({ name: 1 });
    const userIds = facultyUsers.map((f) => f._id);
    const profiles = await FacultyProfileModel.find({ user: { $in: userIds } });

    const profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.user.toString(), p));

    const enriched = facultyUsers.map((f) => {
      const p = profileMap.get(f._id.toString());
      return {
        id: f._id.toString(),
        name: f.name,
        email: f.email,
        phone: f.phone,
        designation: f.designation,
        avatar: f.avatar,
        employeeId: p?.employeeId || '',
        department: p?.department || 'Academic Instruction',
        qualifications: p?.qualifications || 'Post Graduate in Education',
        experienceYears: p?.experienceYears || 5,
        assignedClasses: p?.assignedClasses || [],
        subjects: p?.subjects || [],
      };
    });

    return NextResponse.json({ success: true, faculty: enriched });
  } catch (error: any) {
    console.error('Faculty fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve faculty directory.' }, { status: 500 });
  }
}
