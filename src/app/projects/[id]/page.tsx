import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { acceptProposal, submitProposal } from "@/server/actions/projects";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const project = await db.project.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true } },
      proposals: { include: { freelancer: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!project) notFound();

  const isOwner = session?.user?.id === project.clientId;
  const role = (session?.user as { role?: string } | undefined)?.role;
  const myProposal = project.proposals.find(p => p.freelancerId === session?.user?.id);
  const canBid = session?.user && role === "FREELANCER" && !isOwner && !myProposal && project.status === "OPEN";

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-brand-indigo">{project.title}</h1>
        <p className="text-sm text-slate-500 mt-1">by {project.client.name} · {project.status} · {project.currency}</p>
        <p className="mt-4 text-slate-700 whitespace-pre-line">{project.description}</p>
      </header>

      {canBid && (
        <section className="bg-brand-ice border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-brand-indigo mb-3">Submit a proposal</h2>
          <form action={async (formData: FormData) => { "use server"; await submitProposal(formData); }} className="space-y-3">
            <input type="hidden" name="projectId" value={project.id} />
            <textarea name="coverLetter" required minLength={50} rows={5} placeholder="Why you're the right fit…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input name="bidAmount" type="number" min={1} step="0.01" required placeholder="Bid amount"
                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm" />
              <input name="deliveryDays" type="number" min={1} required placeholder="Delivery days"
                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm" />
            </div>
            <button type="submit" className="w-full bg-brand-indigo text-white font-bold py-3 rounded-lg">Send proposal</button>
          </form>
        </section>
      )}

      {myProposal && (
        <p className="text-sm bg-slate-100 rounded-lg px-4 py-3">
          Your proposal — status: <strong>{myProposal.status}</strong>
        </p>
      )}

      <section>
        <h2 className="font-bold text-brand-indigo mb-3">Proposals ({project.proposals.length})</h2>
        <ul className="space-y-3">
          {project.proposals.map(pr => (
            <li key={pr.id} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-800">{pr.freelancer.name}</p>
                  <p className="text-xs text-slate-500">Bid {pr.bidAmount.toString()} {pr.currency} · {pr.deliveryDays} days</p>
                </div>
                {isOwner && pr.status === "PENDING" && project.status === "OPEN" ? (
                  <form action={acceptProposal.bind(null, pr.id)}>
                    <button className="bg-brand-lime text-brand-dark-indigo font-bold px-4 py-2 rounded-lg text-sm">Accept</button>
                  </form>
                ) : (
                  <span className="text-xs font-bold text-slate-500">{pr.status}</span>
                )}
              </div>
              <p className="text-sm text-slate-600 mt-3 whitespace-pre-line">{pr.coverLetter}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
