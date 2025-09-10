import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { AnimatedDashboard } from "@/components/dashboard/AnimatedDashboard";

export default async function DashboardPage() {
  const session = await requireAuth();
  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role?: string }).role ?? "borrower";

  const [apps, totals] = await Promise.all([
    prisma.application.findMany({
      where: {
        ...(role === "admin" || role === "broker" ? {} : { userId }),
        // Only exclude drafts for brokers and admins, borrowers can see their drafts
        ...(role === "admin" || role === "broker" ? { status: { not: "draft" } } : {})
      },
      orderBy: { createdAt: "desc" },
      include: { documents: true },
    }),
    prisma.application.groupBy({
      by: ["status"],
      _count: true,
      where: {
        ...(role === "admin" || role === "broker" ? {} : { userId }),
        // Only exclude drafts for brokers and admins, borrowers can see their drafts
        ...(role === "admin" || role === "broker" ? { status: { not: "draft" } } : {})
      },
    }),
  ]);

  const countBy = Object.fromEntries(totals.map((t) => [t.status, t._count]));

  return (
    <main className="space-y-8">
      {/* Hero Section */}
      <HeroSection 
        userName={session.user?.name || undefined}
        subtitle="Track your mortgage applications and upload documents securely."
        actionText="New Application"
        actionHref="/applications/new"
      />

      {/* Animated Dashboard */}
      <AnimatedDashboard 
        apps={apps}
        countBy={countBy}
        role={role}
        userName={session.user?.name || undefined}
      />
    </main>
  );
}