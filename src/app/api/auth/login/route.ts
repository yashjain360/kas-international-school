import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { UserModel } from '@/server/models';
import { comparePassword, signToken, setAuthCookie } from '@/server/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json({ error: 'Invalid institutional email or credentials' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Account is deactivated. Contact administration.' }, { status: 403 });
    }

    if (!user.passwordHash) {
      return NextResponse.json({ error: 'Please sign in with Google' }, { status: 400 });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid password. Please verify your credentials.' }, { status: 401 });
    }

    user.lastLogin = new Date();
    await user.save();

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
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
  }
}
