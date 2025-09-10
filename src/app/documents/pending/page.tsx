import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PendingDocuments } from "@/components/broker/PendingDocuments";

export default async function PendingDocumentsPage() {
  await requireRole(["broker", "admin"]);
  
  // Fetch pending documents that need attention
  const pendingDocuments = await prisma.document.findMany({
    where: { status: "pending_scan" },
    include: {
      application: {
        select: {
          id: true,
          propertyAddress: true,
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
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pending Documents</h1>
          <p className="mt-2 text-gray-600">
            Review and approve documents that require your attention
          </p>
        </div>
        
        <PendingDocuments documents={pendingDocuments} />
      </main>
    </div>
  );
}
