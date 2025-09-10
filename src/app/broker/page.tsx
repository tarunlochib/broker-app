import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EnhancedBrokerDashboard } from "@/components/broker/EnhancedBrokerDashboard";

export default async function BrokerPage() {
  await requireRole(["broker", "admin"]);
  
  // Fetch comprehensive broker data with additional metrics
  const [
    applications,
    clients,
    stats,
    recentActivity,
    pendingDocuments,
    monthlyStats,
    topClients
  ] = await Promise.all([
    // Only submitted applications for broker to manage (exclude drafts)
    prisma.application.findMany({
      where: {
        status: {
          not: "draft"
        }
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        documents: {
          select: {
            id: true,
            fileName: true,
            status: true,
            createdAt: true,
          }
        },
        // Comments removed due to Prisma client issue
      },
      take: 20,
    }),
    
    // All clients (borrowers)
    prisma.user.findMany({
      where: { role: "borrower" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        applications: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            loanAmount: true,
          }
        }
      },
      take: 10,
    }),
    
    // Application statistics (excluding drafts)
    prisma.application.groupBy({
      where: {
        status: {
          not: "draft"
        }
      },
      by: ["status"],
      _count: true,
      _sum: {
        loanAmount: true,
      },
      _avg: {
        loanAmount: true,
      }
    }),
    
    // Recent activity (comments, status changes, etc.) - simplified for now
    [],

    // Pending documents that need attention
    prisma.document.findMany({
      where: { status: "pending_scan" },
      include: {
        application: {
          select: {
            id: true,
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
      take: 10,
    }),

    // Monthly statistics for charts (excluding drafts)
    prisma.application.findMany({
      where: {
        status: {
          not: "draft"
        },
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1)
        }
      },
      select: {
        createdAt: true,
        status: true,
        loanAmount: true,
      }
    }),

    // Top clients by loan volume (only submitted applications)
    prisma.user.findMany({
      where: { role: "borrower" },
      include: {
        applications: {
          where: {
            status: {
              not: "draft"
            }
          },
          select: {
            loanAmount: true,
            status: true,
          }
        }
      },
      take: 5,
    })
  ]);

  // Calculate enhanced metrics
  const totalApplications = applications.length;
  const totalClients = clients.length;
  const totalLoanVolume = stats.reduce((sum: number, stat: any) => sum + (stat._sum.loanAmount || 0), 0);
  const averageLoanAmount = stats.reduce((sum: number, stat: any) => sum + (stat._avg.loanAmount || 0), 0) / stats.length || 0;
  const pendingDocumentsCount = pendingDocuments.length;
  
  const statusCounts = stats.reduce((acc: Record<string, number>, stat: any) => {
    acc[stat.status] = stat._count;
    return acc;
  }, {} as Record<string, number>);

  // Calculate monthly trends
  const monthlyTrends = monthlyStats.reduce((acc: Record<string, { count: number; volume: number }>, app: any) => {
    const month = app.createdAt.toISOString().slice(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = { count: 0, volume: 0 };
    }
    acc[month].count++;
    acc[month].volume += app.loanAmount || 0;
    return acc;
  }, {} as Record<string, { count: number; volume: number }>);

  // Calculate top clients
  const topClientsData = topClients.map((client: any) => ({
    ...client,
    totalLoanVolume: client.applications.reduce((sum: number, app: any) => sum + (app.loanAmount || 0), 0),
    applicationCount: client.applications.length,
  })).sort((a: any, b: any) => b.totalLoanVolume - a.totalLoanVolume);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EnhancedBrokerDashboard
          applications={applications}
          clients={clients}
          stats={{
            totalApplications,
            totalClients,
            totalLoanVolume,
            averageLoanAmount,
            statusCounts,
            pendingDocumentsCount,
          }}
          recentActivity={recentActivity}
          pendingDocuments={pendingDocuments}
          monthlyTrends={monthlyTrends}
          topClients={topClientsData}
        />
      </main>
    </div>
  );
}
