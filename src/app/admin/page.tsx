import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireRole(["admin", "broker"]);
  const clients = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">All Clients</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Joined</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}


