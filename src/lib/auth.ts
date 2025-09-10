import { getServerSession, type Session } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";

export async function requireAuth() {
  const session = (await getServerSession(authConfig)) as
    | (Session & { user?: { id?: string; role?: string } })
    | null;
  if (!session || !session.user) redirect("/signin");
  return session as Session & { user: { id: string; role?: string } };
}

export async function requireRole(roles: string[]) {
  try {
    const session = await requireAuth();
    const role = (session.user as { role?: string }).role ?? "borrower";
    if (!roles.includes(role)) {
      console.error(`Access denied: User role '${role}' not in required roles:`, roles);
      throw new Error("Forbidden");
    }
    return session;
  } catch (error) {
    console.error("requireRole error:", error);
    throw error;
  }
}


