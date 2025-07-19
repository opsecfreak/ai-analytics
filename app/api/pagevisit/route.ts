import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { sessionId, url, referrer, timeSpent } = await req.json();

  if (!sessionId || !url) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const visit = await prisma.pageVisit.create({
      data: {
        sessionId,
        url,
        referrer,
        timeSpent,
      },
    });

    return NextResponse.json(visit);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to record page visit' }, { status: 500 });
  }
}
