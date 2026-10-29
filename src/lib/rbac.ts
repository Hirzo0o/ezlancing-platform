import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export type Role = "CLIENT" | "FREELANCER" | "ADMIN";

export async function requireUser() {
  const s = await auth();
  if (!s?.user) redirect("/login");
  return s.user as { id: string; email: string; name?: string | null; role: Role };
}

export async function requireRole(role: Role) {
  const u = await requireUser();
  if (u.role !== role && u.role !== "ADMIN") throw new Error("Forbidden");
  return u;
}
