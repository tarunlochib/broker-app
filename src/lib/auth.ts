import { getServerSession, type Session } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";

export async function requireAuth() {
  const session = (await getServerSession(authConfig as any)) as
    | (Session & { user?: { id?: string; role?: string } })
    | null;
  if (!session || !session.user) redirect("/signin");
  return session as Session & { user: { id: string; role?: string } };
}

export async function requireRole(roles: string[]) {
  const session = await requireAuth();
  const role = (session.user as any).role ?? "borrower";
  if (!roles.includes(role)) throw new Error("Forbidden");
  return session;
}


