import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { UserModel, StudentProfileModel } from '@/server/models';
import { getSessionUser, hashPassword } from '@/server/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const grade = searchParams.get('grade');
    const search = searchParams.get('search');

    await connectToDatabase();
    const query: any = { role: 'student' };
    if (grade && grade !== 'all') query.grade = grade;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { admissionNo: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await UserModel.find(query).sort({ admissionNo: 1 });
    const userIds = students.map((s) => s._id);
    const profiles = await StudentProfileModel.find({ user: { $in: userIds } });

    const profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.user.toString(), p));

    const enrichedStudents = students.map((st) => ({
      id: st._id.toString(),
      name: st.name,
      email: st.email,
      admissionNo: st.admissionNo,
      grade: st.grade,
      section: st.section,
      phone: st.phone,
      avatar: st.avatar,
      isActive: st.isActive,
      profile: profileMap.get(st._id.toString()),
    }));

    return NextResponse.json({ success: true, students: enrichedStudents });
  } catch (error: any) {
    console.error('Students fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve students roster.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin privilege required.' }, { status: 403 });
    }

    const {
      name,
      email,
      grade,
      section,
      parentName,
      parentPhone,
      parentEmail,
      address,
      dob,
      bloodGroup,
      gender,
      busRoute,
    } = await req.json();

    if (!name || !email || !grade || !section || !parentName || !parentPhone) {
      return NextResponse.json({ error: 'Please fill in all mandatory student enrollment fields.' }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 400 });
    }

    const studentCount = await UserModel.countDocuments({ role: 'student' });
    const admissionNo = `KAS2026-${1006 + studentCount}`;
    const passwordHash = await hashPassword('KasStudent@2026');

    const newUser = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'student',
      passwordHash,
      phone: parentPhone,
      admissionNo,
      grade,
      section,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    });

    const newProfile = await StudentProfileModel.create({
      user: newUser._id,
      admissionNo,
      rollNo: `${grade.replace('Grade ', '')}${section}-${String(studentCount + 1).padStart(2, '0')}`,
      grade,
      section,
      dob: dob || '2012-01-01',
      bloodGroup: bloodGroup || 'O+',
      gender: gender || 'Male',
      parentName,
      parentPhone,
      parentEmail: parentEmail || email,
      address: address || 'Bhopal, Madhya Pradesh',
      emergencyContact: parentPhone,
      busRoute: busRoute || 'Route 4 - Regal Town',
    });

    return NextResponse.json({
      success: true,
      message: `Student ${name} enrolled successfully with Admission No ${admissionNo}.`,
      student: { ...newUser.toObject(), profile: newProfile },
    });
  } catch (error: any) {
    console.error('Student enrollment error:', error);
    return NextResponse.json({ error: 'Failed to enroll student.' }, { status: 500 });
  }
}
