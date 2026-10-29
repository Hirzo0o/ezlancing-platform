import Link from "next/link";
import { db } from "@/lib/db";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    where: { status: "OPEN" }, orderBy: { createdAt: "desc" }, take: 30,
    include: { client: { select: { name: true } }, _count: { select: { proposals: true } } },
  });
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-brand-indigo">Open projects</h1>
        <Link href="/projects/new" className="bg-brand-lime text-brand-dark-indigo font-bold px-4 py-2.5 rounded-lg">Post a project</Link>
      </div>
      {projects.length === 0 && <p className="text-slate-500 text-sm">No open projects yet.</p>}
      <ul className="space-y-3">
        {projects.map(p => (
          <li key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-card transition">
            <Link href={`/projects/${p.id}`} className="block">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold text-brand-indigo">{p.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">by {p.client.name ?? "Client"} · {p._count.proposals} proposals</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-400">Budget</p>
                  <p className="font-extrabold text-brand-indigo">
                    {p.budgetMin && p.budgetMax ? `${p.budgetMin}–${p.budgetMax} ${p.currency}` : `— ${p.currency}`}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-3 line-clamp-2">{p.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
