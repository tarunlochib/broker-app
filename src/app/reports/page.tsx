import { requireRole } from "@/lib/auth";
import { MonthlyTrends } from "@/components/broker/MonthlyTrends";
import { TopClients } from "@/components/broker/TopClients";
import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  await requireRole(["broker", "admin"]);
  
  // Fetch data for reports
  const [
    monthlyStats,
    topClients,
    performanceStats
  ] = await Promise.all([
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
      take: 10,
    }),

    // Performance statistics (excluding drafts)
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
    })
  ]);

  // Calculate monthly trends
  const monthlyTrends = monthlyStats.reduce((acc, app) => {
    const month = app.createdAt.toISOString().slice(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = { count: 0, volume: 0 };
    }
    acc[month].count++;
    acc[month].volume += app.loanAmount || 0;
    return acc;
  }, {} as Record<string, { count: number; volume: number }>);

  // Calculate top clients
  const topClientsData = topClients.map(client => ({
    ...client,
    totalLoanVolume: client.applications.reduce((sum, app) => sum + (app.loanAmount || 0), 0),
    applicationCount: client.applications.length,
  })).sort((a, b) => b.totalLoanVolume - a.totalLoanVolume);

  // Calculate performance metrics
  const totalApplications = monthlyStats.length;
  const totalLoanVolume = performanceStats.reduce((sum, stat) => sum + (stat._sum.loanAmount || 0), 0);
  const averageLoanAmount = performanceStats.reduce((sum, stat) => sum + (stat._avg.loanAmount || 0), 0) / performanceStats.length || 0;
  const approvedCount = performanceStats.find(stat => stat.status === 'approved')?._count || 0;
  const conversionRate = totalApplications > 0 ? Math.round((approvedCount / totalApplications) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Performance Reports</h1>
          <p className="mt-2 text-gray-600">
            Track your business performance and key metrics
          </p>
        </div>

        <div className="space-y-8">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Applications</h3>
              <p className="text-3xl font-bold text-gray-900">{totalApplications}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Loan Volume</h3>
              <p className="text-3xl font-bold text-gray-900">
                ${totalLoanVolume.toLocaleString('en-AU', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Average Loan</h3>
              <p className="text-3xl font-bold text-gray-900">
                ${averageLoanAmount.toLocaleString('en-AU', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Conversion Rate</h3>
              <p className="text-3xl font-bold text-green-600">{conversionRate}%</p>
            </div>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MonthlyTrends trends={monthlyTrends} />
            <TopClients clients={topClientsData} />
          </div>

          {/* Status Breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {performanceStats.map((stat) => (
                <div key={stat.status} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat._count}</div>
                  <div className="text-sm text-gray-600 capitalize">{stat.status.replace('_', ' ')}</div>
                  <div className="text-xs text-gray-500">
                    ${(stat._sum.loanAmount || 0).toLocaleString('en-AU', { maximumFractionDigits: 0 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
