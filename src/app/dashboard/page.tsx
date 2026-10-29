export const instant = false;

import Link from "next/link";
import { requireUser } from "@/lib/rbac";

export default async function DashboardPage() {
  const user = await requireUser();
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-brand-indigo">Dashboard</h1>
      <p className="text-slate-600 mt-1">Welcome, {user.name ?? user.email} · <span className="font-bold">{user.role}</span></p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/projects" className="bg-brand-indigo text-white px-4 py-2 rounded-lg">Browse projects</Link>
        {user.role === "CLIENT" && (
          <Link href="/projects/new" className="bg-brand-lime text-brand-dark-indigo px-4 py-2 rounded-lg font-bold">Post a project</Link>
        )}
      </div>
    </main>
  );
}
