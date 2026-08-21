import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { UserModel, StudentProfileModel } from '@/server/models';
import { signToken, setAuthCookie } from '@/server/auth';

export async function POST(req: NextRequest) {
  try {
    const { credential, email: directEmail, name: directName } = await req.json();

    let email = directEmail;
    let name = directName;
    let googleId = '';
    let avatar = '';

    if (credential) {
      // Decode JWT token from Google Identity Services
      const payloadBase64 = credential.split('.')[1];
      const decodedJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
      const googleData = JSON.parse(decodedJson);
      
      email = googleData.email;
      name = googleData.name || googleData.given_name;
      googleId = googleData.sub;
      avatar = googleData.picture;
    }

    if (!email) {
      return NextResponse.json({ error: 'Failed to verify Google Identity' }, { status: 400 });
    }

    await connectToDatabase();
    let user = await UserModel.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // For any new Google-authenticated user, auto-enroll as Student or match by email
      const studentCount = await UserModel.countDocuments({ role: 'student' });
      const nextAdmNo = `KAS2026-${1006 + studentCount}`;

      user = await UserModel.create({
        name: name || 'Student Scholar',
        email: email.toLowerCase().trim(),
        role: 'student',
        googleId,
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        admissionNo: nextAdmNo,
        grade: 'Grade 10',
        section: 'A',
        isActive: true,
        lastLogin: new Date(),
      });

      await StudentProfileModel.create({
        user: user._id,
        admissionNo: nextAdmNo,
        rollNo: `10A-${String(studentCount + 1).padStart(2, '0')}`,
        grade: 'Grade 10',
        section: 'A',
        dob: '2010-06-15',
        bloodGroup: 'B+',
        gender: 'Male',
        parentName: `${name} Guardian`,
        parentPhone: '+91 94259 92209',
        parentEmail: email,
        address: 'Bhopal Campus Resident, MP',
        emergencyContact: '+91 94259 92209',
      });
    } else {
      user.lastLogin = new Date();
      if (googleId) user.googleId = googleId;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      admissionNo: user.admissionNo,
      grade: user.grade,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        admissionNo: user.admissionNo,
        grade: user.grade,
        section: user.section,
        avatar: user.avatar,
      },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error: any) {
    console.error('Google Auth error:', error);
    return NextResponse.json({ error: 'Failed to authenticate with Google' }, { status: 500 });
  }
}
