import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminApplicationsPage() {
  await requireRole(["admin", "broker"]);
  const apps = await prisma.application.findMany({ 
    where: {
      status: {
        not: "draft"
      }
    },
    orderBy: { createdAt: "desc" } 
  });
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">All Applications</h1>
      <ul className="space-y-2">
        {apps.map((a) => (
          <li key={a.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{a.status}</div>
              <div className="text-sm text-gray-500">{new Date(a.createdAt).toLocaleString()}</div>
            </div>
            <Link href={`/applications/${a.id}`} className="text-blue-600 underline">View</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}


