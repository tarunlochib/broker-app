import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

export async function GET() {
  const session = await requireAuth();
  const userId = (session.user as any).id as string;
  const role = (session.user as any).role as string;

  if (role === "admin" || role === "broker") {
    const apps = await prisma.application.findMany({
      where: {
        status: {
          not: "draft"
        }
      },
      orderBy: { createdAt: "desc" },
      include: { documents: true },
    });
    return NextResponse.json(apps);
  }

  const apps = await prisma.application.findMany({
    where: { 
      userId
      // Borrowers can see their own drafts
    },
    orderBy: { createdAt: "desc" },
    include: { documents: true },
  });
  return NextResponse.json(apps);
}

export async function POST(_: Request) {
  await requireRole(["borrower", "broker", "admin"]);
  const session = await requireAuth();
  const userId = (session.user as any).id as string;

  const app = await prisma.application.create({
    data: {
      userId,
      status: "draft",
    },
  });
  return NextResponse.json(app, { status: 201 });
}
