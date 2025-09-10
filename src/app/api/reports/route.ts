import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await requireRole(["broker", "admin"]);
    
    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get('type') || 'overview';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const dateFilter = startDate && endDate ? {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } : {};

    switch (reportType) {
      case 'overview':
        return await getOverviewReport(dateFilter);
      case 'applications':
        return await getApplicationsReport(dateFilter);
      case 'clients':
        return await getClientsReport(dateFilter);
      case 'performance':
        return await getPerformanceReport(dateFilter);
      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}

async function getOverviewReport(dateFilter: { createdAt?: { gte?: Date; lte?: Date } }) {
  const combinedFilter = {
    ...dateFilter,
    status: {
      not: "draft"
    }
  };

  const [
    totalApplications,
    totalClients,
    totalLoanVolume,
    statusBreakdown,
    monthlyTrends
  ] = await Promise.all([
    prisma.application.count({ where: combinedFilter }),
    prisma.user.count({ where: { role: "borrower", ...dateFilter } }),
    prisma.application.aggregate({
      where: combinedFilter,
      _sum: { loanAmount: true },
      _avg: { loanAmount: true }
    }),
    prisma.application.groupBy({
      by: ["status"],
      where: combinedFilter,
      _count: true,
      _sum: { loanAmount: true }
    }),
    prisma.application.findMany({
      where: combinedFilter,
      select: {
        createdAt: true,
        loanAmount: true,
        status: true
      },
      orderBy: { createdAt: "desc" },
      take: 100
    })
  ]);

  return NextResponse.json({
    totalApplications,
    totalClients,
    totalLoanVolume: totalLoanVolume._sum.loanAmount || 0,
    averageLoanAmount: totalLoanVolume._avg.loanAmount || 0,
    statusBreakdown,
    monthlyTrends: calculateMonthlyTrends(monthlyTrends)
  });
}

async function getApplicationsReport(dateFilter: { createdAt?: { gte?: Date; lte?: Date } }) {
  const combinedFilter = {
    ...dateFilter,
    status: {
      not: "draft"
    }
  };

  const applications = await prisma.application.findMany({
    where: combinedFilter,
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
        documents: {
          select: {
            id: true,
            fileName: true,
            status: true,
          }
        }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ applications });
}

async function getClientsReport(dateFilter: { createdAt?: { gte?: Date; lte?: Date } }) {
  const clients = await prisma.user.findMany({
    where: { role: "borrower", ...dateFilter },
    include: {
      applications: {
        where: {
          status: {
            not: "draft"
          }
        },
        select: {
          id: true,
          status: true,
          loanAmount: true,
          createdAt: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const clientsWithMetrics = clients.map((client: { applications: { loanAmount: number | null; status: string }[] }) => ({
    ...client,
    totalLoanVolume: client.applications.reduce((sum: number, app: { loanAmount: number | null }) => sum + (app.loanAmount || 0), 0),
    applicationCount: client.applications.length,
    approvedApplications: client.applications.filter((app: { status: string }) => app.status === 'approved').length
  }));

  return NextResponse.json({ clients: clientsWithMetrics });
}

async function getPerformanceReport(dateFilter: { createdAt?: { gte?: Date; lte?: Date } }) {
  const combinedFilter = {
    ...dateFilter,
    status: {
      not: "draft"
    }
  };

  const applications = await prisma.application.findMany({
    where: combinedFilter,
    select: {
      status: true,
      createdAt: true,
      loanAmount: true
    }
  });

  const performance = {
    conversionRate: 0,
    averageProcessingTime: 0,
    totalVolume: applications.reduce((sum: number, app: { loanAmount: number | null }) => sum + (app.loanAmount || 0), 0),
    statusDistribution: applications.reduce((acc: Record<string, number>, app: { status: string }) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  const approvedCount = performance.statusDistribution['approved'] || 0;
  performance.conversionRate = applications.length > 0 ? (approvedCount / applications.length) * 100 : 0;

  return NextResponse.json({ performance });
}

function calculateMonthlyTrends(applications: { createdAt: Date; loanAmount: number | null }[]) {
  const trends = applications.reduce((acc, app) => {
    const month = app.createdAt.toISOString().slice(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = { count: 0, volume: 0 };
    }
    acc[month].count++;
    acc[month].volume += app.loanAmount || 0;
    return acc;
  }, {} as Record<string, { count: number; volume: number }>);

  return Object.entries(trends)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }));
}
