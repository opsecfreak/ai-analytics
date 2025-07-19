// app/api/log.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, url, timeSpent, referrer } = await req.json();

    if (!sessionId || !url || !timeSpent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pageVisit = await prisma.pageVisit.create({
      data: {
        sessionId,
        url,
        timeSpent,
        referrer,
      },
    });

    return NextResponse.json(pageVisit);
  } catch (error) {
    console.error("Log API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
