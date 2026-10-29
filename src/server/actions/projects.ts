"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

const createSchema = z.object({
  title: z.string().min(10).max(140),
  description: z.string().min(50).max(8000),
  budgetMin: z.coerce.number().positive().optional(),
  budgetMax: z.coerce.number().positive().optional(),
  currency: z.enum(["USD","AED","SAR","EGP","JOD"]).default("USD"),
  deadline: z.string().optional().transform(v => v ? new Date(v) : undefined),
});

export async function createProject(formData: FormData) {
  const user = await requireRole("CLIENT");
  const p = createSchema.safeParse(Object.fromEntries(formData));
  if (!p.success) return { error: p.error.issues[0]?.message ?? "Invalid input" };
  const d = p.data;
  if (d.budgetMin && d.budgetMax && d.budgetMin > d.budgetMax) return { error: "Min > Max" };

  const project = await db.project.create({
    data: {
      clientId: user.id, title: d.title, description: d.description,
      budgetMin: d.budgetMin, budgetMax: d.budgetMax,
      currency: d.currency, deadline: d.deadline, status: "OPEN",
    },
  });
  revalidatePath("/projects");
  return { ok: true, projectId: project.id };
}

const proposalSchema = z.object({
  projectId: z.string().min(1),
  coverLetter: z.string().min(50).max(4000),
  bidAmount: z.coerce.number().positive(),
  deliveryDays: z.coerce.number().int().positive().max(365),
});

export async function submitProposal(formData: FormData) {
  const user = await requireRole("FREELANCER");
  const p = proposalSchema.safeParse(Object.fromEntries(formData));
  if (!p.success) return { error: p.error.issues[0]?.message ?? "Invalid input" };
  const d = p.data;

  const project = await db.project.findUnique({ where: { id: d.projectId } });
  if (!project) return { error: "Project not found" };
  if (project.status !== "OPEN") return { error: "Project is not accepting proposals" };
  if (project.clientId === user.id) return { error: "You cannot bid on your own project" };

  try {
    await db.proposal.create({
      data: {
        projectId: d.projectId, freelancerId: user.id,
        coverLetter: d.coverLetter, bidAmount: d.bidAmount,
        currency: project.currency, deliveryDays: d.deliveryDays,
      },
    });
  } catch (e) {
    if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") {
      return { error: "You already submitted a proposal" };
    }
    throw e;
  }
  revalidatePath(`/projects/${d.projectId}`);
  return { ok: true };
}

export async function acceptProposal(proposalId: string) {
  const user = await requireRole("CLIENT");

  await db.$transaction(async (tx) => {
    const proposal = await tx.proposal.findUnique({
      where: { id: proposalId }, include: { project: true },
    });
    if (!proposal) throw new Error("Proposal not found");
    if (proposal.project.clientId !== user.id) throw new Error("Not your project");
    if (proposal.status !== "PENDING") throw new Error("Proposal not pending");
    if (proposal.project.status !== "OPEN") throw new Error("Project not open");

    await tx.proposal.updateMany({
      where: { projectId: proposal.projectId, id: { not: proposalId } },
      data: { status: "REJECTED" },
    });
    await tx.proposal.update({ where: { id: proposalId }, data: { status: "ACCEPTED" } });

    const contract = await tx.contract.create({
      data: {
        projectId: proposal.projectId, freelancerId: proposal.freelancerId,
        totalAmount: proposal.bidAmount, currency: proposal.currency,
      },
    });
    await tx.milestone.create({
      data: {
        contractId: contract.id, title: "Full delivery",
        amount: proposal.bidAmount, status: "PENDING",
        dueAt: new Date(Date.now() + proposal.deliveryDays * 86_400_000),
      },
    });
    await tx.project.update({ where: { id: proposal.projectId }, data: { status: "IN_PROGRESS" } });
    await tx.notification.create({
      data: {
        userId: proposal.freelancerId, type: "PROPOSAL_ACCEPTED",
        payload: { projectId: proposal.projectId, contractId: contract.id },
      },
    });
  });
  revalidatePath("/dashboard");
  revalidatePath("/projects");
}
