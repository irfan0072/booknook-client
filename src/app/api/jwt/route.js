import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'booknook_secure_jwt_secret_key_2024';

export async function POST(req) {
  try {
    const user = await req.json();
    if (!user || !user.email) {
      return NextResponse.json({ message: 'User email is required' }, { status: 400 });
    }

    const token = jwt.sign(user, jwtSecret, { expiresIn: '7d' });
    return NextResponse.json({ success: true, token });
  } catch (err) {
    return NextResponse.json({ message: 'Error issuing token', error: err.message }, { status: 500 });
  }
}
