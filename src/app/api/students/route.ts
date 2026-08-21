import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { UserModel, StudentProfileModel, FeeRecordModel, GradeRecordModel } from '@/server/models';
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
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await UserModel.find(query).sort({ admissionNo: 1 });
    const userIds = students.map((s) => s._id);
    const profiles = await StudentProfileModel.find({ user: { $in: userIds } });

    const profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.user.toString(), p));

    const enrichedStudents = students.map((st) => {
      const prof = profileMap.get(st._id.toString());
      return {
        id: st._id.toString(),
        name: st.name,
        email: st.email,
        admissionNo: st.admissionNo,
        grade: st.grade,
        section: st.section,
        phone: st.phone,
        avatar: st.avatar,
        isActive: st.isActive,
        profile: prof
          ? {
              id: prof._id.toString(),
              parentName: prof.parentName,
              parentPhone: prof.parentPhone,
              parentEmail: prof.parentEmail,
              dob: prof.dob,
              bloodGroup: prof.bloodGroup,
              gender: prof.gender,
              address: prof.address,
              busRoute: prof.busRoute,
              rollNo: prof.rollNo,
            }
          : undefined,
      };
    });

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

    const body = await req.json();
    const {
      name,
      email,
      grade,
      section,
      phone,
      parentName,
      parentPhone,
      parentEmail,
      address,
      dob,
      bloodGroup,
      gender,
      busRoute,
      rollNo,
      avatar,
      initialPassword,
      customAdmissionNo,
    } = body;

    if (!name || !email || !grade || !section || !parentName || !parentPhone) {
      return NextResponse.json(
        { error: 'Please fill in all mandatory fields: Student Name, Email, Grade, Section, Parent Name, and Parent Phone.' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const existing = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: 'A student or user with this email already exists.' }, { status: 400 });
    }

    const studentCount = await UserModel.countDocuments({ role: 'student' });
    const admissionNo = customAdmissionNo ? customAdmissionNo.trim() : `KAS2026-${1006 + studentCount}`;
    const passwordHash = await hashPassword(initialPassword || 'KasStudent@2026');

    const newUser = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'student',
      passwordHash,
      phone: phone?.trim() || parentPhone.trim(),
      admissionNo,
      grade: grade.trim(),
      section: section.trim(),
      avatar:
        avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    });

    const newProfile = await StudentProfileModel.create({
      user: newUser._id,
      admissionNo,
      rollNo: rollNo?.trim() || `${grade.replace('Grade ', '')}${section}-${String(studentCount + 1).padStart(2, '0')}`,
      grade: grade.trim(),
      section: section.trim(),
      dob: dob || '2012-01-01',
      bloodGroup: bloodGroup || 'O+',
      gender: gender || 'Male',
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: (parentEmail || email).toLowerCase().trim(),
      address: address || 'Bhopal, Madhya Pradesh',
      emergencyContact: parentPhone.trim(),
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

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin privilege required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      name,
      email,
      phone,
      grade,
      section,
      admissionNo,
      avatar,
      parentName,
      parentPhone,
      parentEmail,
      dob,
      bloodGroup,
      gender,
      address,
      busRoute,
      rollNo,
      newPassword,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Student ID is required.' }, { status: 400 });
    }

    await connectToDatabase();
    const userDoc = await UserModel.findById(id);
    if (!userDoc || userDoc.role !== 'student') {
      return NextResponse.json({ error: 'Student record not found.' }, { status: 404 });
    }

    if (name) userDoc.name = name.trim();
    if (email) userDoc.email = email.toLowerCase().trim();
    if (phone !== undefined) userDoc.phone = phone.trim();
    if (grade) userDoc.grade = grade.trim();
    if (section) userDoc.section = section.trim();
    if (admissionNo) userDoc.admissionNo = admissionNo.trim();
    if (avatar) userDoc.avatar = avatar;
    if (newPassword) {
      userDoc.passwordHash = await hashPassword(newPassword);
    }
    await userDoc.save();

    // Update Profile
    const profileData: any = {};
    if (admissionNo) profileData.admissionNo = admissionNo.trim();
    if (grade) profileData.grade = grade.trim();
    if (section) profileData.section = section.trim();
    if (rollNo) profileData.rollNo = rollNo.trim();
    if (dob) profileData.dob = dob;
    if (bloodGroup) profileData.bloodGroup = bloodGroup;
    if (gender) profileData.gender = gender;
    if (parentName) profileData.parentName = parentName.trim();
    if (parentPhone) profileData.parentPhone = parentPhone.trim();
    if (parentEmail) profileData.parentEmail = parentEmail.toLowerCase().trim();
    if (address) profileData.address = address.trim();
    if (busRoute) profileData.busRoute = busRoute.trim();

    const updatedProfile = await StudentProfileModel.findOneAndUpdate(
      { user: userDoc._id },
      { $set: profileData },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: `Student record for ${userDoc.name} updated successfully.`,
      student: { ...userDoc.toObject(), profile: updatedProfile },
    });
  } catch (error: any) {
    console.error('Student update error:', error);
    return NextResponse.json({ error: 'Failed to update student profile.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin privilege required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Student ID is required.' }, { status: 400 });
    }

    await connectToDatabase();
    const userDoc = await UserModel.findById(id);
    if (!userDoc || userDoc.role !== 'student') {
      return NextResponse.json({ error: 'Student record not found.' }, { status: 404 });
    }

    const studentName = userDoc.name;
    const admissionNo = userDoc.admissionNo;

    // Delete associated documents
    await StudentProfileModel.deleteMany({ user: userDoc._id });
    await UserModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Student ${studentName} (${admissionNo}) removed successfully from school registry.`,
    });
  } catch (error: any) {
    console.error('Student deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete student record.' }, { status: 500 });
  }
}
