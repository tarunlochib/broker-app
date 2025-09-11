import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireAuth();
    const userId = (session.user as { id: string }).id;
    const role = (session.user as { role?: string }).role ?? "borrower";

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
  } catch (error) {
    console.error("Error fetching applications:", error);
    
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ 
        error: "You don't have permission to view applications" 
      }, { status: 403 });
    }
    
    return NextResponse.json({ 
      error: "Failed to load applications. Please try again." 
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const userId = (session.user as { id: string }).id;

    const app = await prisma.application.create({
      data: {
        userId,
        status: "draft",
      },
    });
    
    return NextResponse.json(app, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ 
        error: "You don't have permission to create applications" 
      }, { status: 403 });
    }
    
    return NextResponse.json({ 
      error: "Failed to create application. Please try again." 
    }, { status: 500 });
  }
}
