import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ClientManagement } from "@/components/broker/ClientManagement";

export default async function ClientsPage() {
  await requireRole(["broker", "admin"]);
  
  // Fetch all clients with their applications
  const clients = await prisma.user.findMany({
    where: { role: "borrower" },
    orderBy: { createdAt: "desc" },
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
        },
        orderBy: { createdAt: "desc" }
      }
    },
  });

  // Calculate additional metrics for each client
  const clientsWithMetrics = clients.map(client => ({
    ...client,
    totalLoanVolume: client.applications.reduce((sum: number, app: { loanAmount: number | null }) => sum + (app.loanAmount || 0), 0),
    applicationCount: client.applications.length,
    lastApplicationDate: client.applications[0]?.createdAt || null,
    statusCounts: client.applications.reduce((acc: Record<string, number>, app: { status: string }) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your clients and track their application history
          </p>
        </div>
        
        <ClientManagement clients={clientsWithMetrics} />
      </main>
    </div>
  );
}
