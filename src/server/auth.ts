import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { IUser, UserModel } from './models';
import { connectToDatabase } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'kas_international_jwt_secret_secure_key_2026';
const COOKIE_NAME = 'kas_auth_token';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'faculty' | 'student';
  admissionNo?: string;
  grade?: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function comparePassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

export async function getSessionUser(req: NextRequest): Promise<IUser | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || !payload.userId) return null;

  await connectToDatabase();
  const user = await UserModel.findById(payload.userId);
  if (!user || !user.isActive) return null;

  return user;
}

export function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
  return res;
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
