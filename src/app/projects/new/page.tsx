import { redirect } from "next/navigation";
import { requireUser } from "@/lib/rbac";
import { createProject } from "@/server/actions/projects";

export default async function NewProjectPage() {
  const user = await requireUser();
  if (user.role !== "CLIENT") redirect("/dashboard");
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-brand-indigo mb-6">Post a project</h1>
      <form action={async (formData: FormData) => { "use server"; await createProject(formData); }} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200">
        <input name="title" required minLength={10} maxLength={140} placeholder="e.g. Build a Flutter app for a Gulf fintech"
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm" />
        <textarea name="description" required minLength={50} rows={6} placeholder="Describe the work, deliverables, timeline…"
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm" />
        <div className="grid grid-cols-3 gap-3">
          <input name="budgetMin" type="number" min={1} step="0.01" placeholder="Min" className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm" />
          <input name="budgetMax" type="number" min={1} step="0.01" placeholder="Max" className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm" />
          <select name="currency" className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm">
            <option>USD</option><option>AED</option><option>SAR</option><option>EGP</option><option>JOD</option>
          </select>
        </div>
        <input name="deadline" type="date" className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm" />
        <button type="submit" className="w-full bg-brand-lime text-brand-dark-indigo font-bold py-3 rounded-lg">Publish project</button>
      </form>
    </main>
  );
}
