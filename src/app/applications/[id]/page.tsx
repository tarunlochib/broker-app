import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { EnhancedApplicationView } from "@/components/application/EnhancedApplicationView";

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAuth();
  const role = (session.user as any).role as string;
  const userId = (session.user as any).id as string;

  const app = await prisma.application.findUnique({
    where: { id },
    include: { documents: true },
  });
  if (!app) return notFound();
  if (!(role === "admin" || role === "broker") && app.userId !== userId) return notFound();

  return (
    <EnhancedApplicationView 
      application={app} 
      role={role} 
      applicationId={id} 
    />
  );
}


