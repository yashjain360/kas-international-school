import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { UserModel, FacultyProfileModel } from '@/server/models';
import { getSessionUser, hashPassword } from '@/server/auth';

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
        phone: f.phone || '',
        designation: f.designation || 'Faculty In-Charge',
        avatar: f.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        employeeId: p?.employeeId || `FAC-${f._id.toString().slice(-4).toUpperCase()}`,
        department: p?.department || 'Academic Instruction',
        qualifications: p?.qualifications || 'Post Graduate in Education',
        experienceYears: p?.experienceYears || 5,
        assignedClasses: p?.assignedClasses || ['Grade 10', 'Grade 9'],
        subjects: p?.subjects || ['General Science'],
        createdAt: f.createdAt,
      };
    });

    return NextResponse.json({ success: true, faculty: enriched });
  } catch (error: any) {
    console.error('Faculty fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve faculty directory.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin credentials required to create faculty records.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      email,
      phone,
      designation = 'Senior PGT Faculty',
      department = 'Science & Mathematics',
      employeeId,
      qualifications = 'M.Sc., B.Ed.',
      experienceYears = 5,
      assignedClasses = ['Grade 10', 'Grade 9'],
      subjects = ['Physics'],
      password = 'KasFaculty@2026',
      avatar,
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are mandatory fields.' }, { status: 400 });
    }

    await connectToDatabase();

    // Check duplicate email
    const existing = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: 'A faculty member or user with this email already exists.' }, { status: 400 });
    }

    const empId = employeeId ? employeeId.trim() : `FAC-${Date.now().toString().slice(-4)}`;
    const passwordHash = await hashPassword(password);

    const newUser = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      passwordHash,
      role: 'faculty',
      designation: designation.trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      isActive: true,
    });

    const newProfile = await FacultyProfileModel.create({
      user: newUser._id,
      employeeId: empId,
      department: department.trim(),
      designation: designation.trim(),
      qualifications: qualifications.trim(),
      experienceYears: Number(experienceYears) || 5,
      assignedClasses: Array.isArray(assignedClasses) ? assignedClasses : [assignedClasses],
      subjects: Array.isArray(subjects) ? subjects : [subjects],
    });

    return NextResponse.json({
      success: true,
      message: `Faculty record for ${newUser.name} created successfully.`,
      faculty: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        employeeId: newProfile.employeeId,
        department: newProfile.department,
      },
    });
  } catch (error: any) {
    console.error('Faculty create error:', error);
    return NextResponse.json({ error: 'Failed to create faculty member.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin credentials required to edit faculty records.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      name,
      email,
      phone,
      designation,
      department,
      employeeId,
      qualifications,
      experienceYears,
      assignedClasses,
      subjects,
      avatar,
      newPassword,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Faculty ID is required.' }, { status: 400 });
    }

    await connectToDatabase();

    const userDoc = await UserModel.findById(id);
    if (!userDoc || userDoc.role !== 'faculty') {
      return NextResponse.json({ error: 'Faculty member not found.' }, { status: 404 });
    }

    if (name) userDoc.name = name.trim();
    if (email) userDoc.email = email.toLowerCase().trim();
    if (phone !== undefined) userDoc.phone = phone.trim();
    if (designation) userDoc.designation = designation.trim();
    if (avatar) userDoc.avatar = avatar;
    if (newPassword) {
      userDoc.passwordHash = await hashPassword(newPassword);
    }
    await userDoc.save();

    const profileData: any = {};
    if (employeeId) profileData.employeeId = employeeId.trim();
    if (department) profileData.department = department.trim();
    if (designation) profileData.designation = designation.trim();
    if (qualifications) profileData.qualifications = qualifications.trim();
    if (experienceYears !== undefined) profileData.experienceYears = Number(experienceYears);
    if (assignedClasses) profileData.assignedClasses = Array.isArray(assignedClasses) ? assignedClasses : [assignedClasses];
    if (subjects) profileData.subjects = Array.isArray(subjects) ? subjects : [subjects];

    await FacultyProfileModel.findOneAndUpdate({ user: userDoc._id }, profileData, { upsert: true });

    return NextResponse.json({
      success: true,
      message: `Faculty record for ${userDoc.name} updated successfully.`,
    });
  } catch (error: any) {
    console.error('Faculty update error:', error);
    return NextResponse.json({ error: 'Failed to update faculty member.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin credentials required to delete faculty records.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Faculty ID required.' }, { status: 400 });
    }

    await connectToDatabase();

    await UserModel.findByIdAndDelete(id);
    await FacultyProfileModel.findOneAndDelete({ user: id });

    return NextResponse.json({
      success: true,
      message: 'Faculty member deleted successfully.',
    });
  } catch (error: any) {
    console.error('Faculty delete error:', error);
    return NextResponse.json({ error: 'Failed to delete faculty member.' }, { status: 500 });
  }
}
