import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { token, passkey } = await request.json();

    if (!token || !passkey) {
      return NextResponse.json({ error: 'Missing token or passkey' }, { status: 400 });
    }

    // Verify JWT token to get userId
    const decoded = verifyToken(token) as { userId: string };
    if (!decoded?.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Hash passkey
    const hashed = await bcrypt.hash(passkey, 10);

    // Update user with passkey
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { passkey: hashed }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
