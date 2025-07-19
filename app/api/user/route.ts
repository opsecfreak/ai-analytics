import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "@/lib/jwt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Create user in DB
    const user = await prisma.user.create({
      data: { email },
    });

    // 2. Generate a one-time JWT token for this user
    const token = generateToken({ userId: user.id });

    // 3. Store the token in UserToken table with 7 days expiry
    await prisma.userToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 4. Return user info & token to frontend
    return NextResponse.json({ user, token }, { status: 201 });
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET method to fetch all users and their emails
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
