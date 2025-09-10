import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await requireRole(["broker", "admin"]);
    
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';

    const whereClause = {
      role: "borrower" as const,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } }
        ]
      })
    };

    const clients = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        applications: {
          where: {
            status: {
              not: "draft"
            }
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
            loanAmount: true,
            firstName: true,
            lastName: true,
          },
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.user.count({
      where: whereClause
    });

    // Calculate additional metrics for each client
    const clientsWithMetrics = clients.map(client => ({
      ...client,
      totalLoanVolume: client.applications.reduce((sum, app) => sum + (app.loanAmount || 0), 0),
      applicationCount: client.applications.length,
      lastApplicationDate: client.applications[0]?.createdAt || null,
      statusCounts: client.applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    }));

    return NextResponse.json({
      clients: clientsWithMetrics,
      total,
      hasMore: offset + limit < total
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}
