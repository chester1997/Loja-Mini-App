import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contentId, positionSeconds, durationSeconds, completed } = await req.json();

    if (!contentId || positionSeconds === undefined) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const progressPercentage = durationSeconds > 0 
      ? Math.round((positionSeconds / durationSeconds) * 100) 
      : 0;

    const progress = await prisma.watchProgress.upsert({
      where: {
        userId_contentId: {
          userId: user.id,
          contentId,
        }
      },
      update: {
        positionSeconds: Math.floor(positionSeconds),
        durationSeconds: Math.floor(durationSeconds),
        progressPercentage,
        completed: completed || progressPercentage >= 95,
        lastWatchedAt: new Date()
      },
      create: {
        userId: user.id,
        contentId,
        positionSeconds: Math.floor(positionSeconds),
        durationSeconds: Math.floor(durationSeconds),
        progressPercentage,
        completed: completed || progressPercentage >= 95
      }
    });

    // Also update history
    await prisma.watchHistory.create({
      data: {
        userId: user.id,
        contentId,
        watchedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Progress save error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
