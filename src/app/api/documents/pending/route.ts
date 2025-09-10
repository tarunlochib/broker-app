import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await requireRole(["broker", "admin"]);
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending_scan';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const documents = await prisma.document.findMany({
      where: { status },
      include: {
        application: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.document.count({
      where: { status }
    });

    return NextResponse.json({
      documents,
      total,
      hasMore: offset + limit < total
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending documents:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}
