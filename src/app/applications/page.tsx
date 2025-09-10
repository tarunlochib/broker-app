import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ApplicationsPage } from "@/components/applications/ApplicationsPage";

export default async function ApplicationsPageServer() {
  const session = await requireAuth();
  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role?: string }).role ?? "borrower";
  
  const apps = await prisma.application.findMany({
    where: {
      ...(role === "admin" || role === "broker" ? {} : { userId }),
      // Only exclude drafts for brokers and admins, borrowers can see their drafts
      ...(role === "admin" || role === "broker" ? { status: { not: "draft" } } : {})
    },
    orderBy: { createdAt: "desc" },
  });

  return <ApplicationsPage initialApplications={apps} role={role} />;
}


