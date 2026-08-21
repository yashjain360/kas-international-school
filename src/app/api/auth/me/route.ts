import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, clearAuthCookie } from '@/server/auth';
import { StudentProfileModel, FacultyProfileModel } from '@/server/models';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    let extraProfile = null;
    if (user.role === 'student') {
      extraProfile = await StudentProfileModel.findOne({ user: user._id });
    } else if (user.role === 'faculty') {
      extraProfile = await FacultyProfileModel.findOne({ user: user._id });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        designation: user.designation,
        admissionNo: user.admissionNo,
        grade: user.grade,
        section: user.section,
        avatar: user.avatar,
        profile: extraProfile,
      },
    });
  } catch (error: any) {
    console.error('Session verify error:', error);
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  clearAuthCookie(response);
  return response;
}
