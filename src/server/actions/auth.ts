"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  role: z.enum(["CLIENT", "FREELANCER"]),
});

export async function registerAction(formData: FormData) {
  const p = registerSchema.safeParse(Object.fromEntries(formData));
  if (!p.success) return { error: p.error.issues[0]?.message ?? "Invalid input" };
  const { name, email, password, role } = p.data;
  const lower = email.toLowerCase();

  const exists = await db.user.findUnique({ where: { email: lower } });
  if (exists) return { error: "Email already registered" };

  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.create({ data: { email: lower, name, role, passwordHash, status: "PENDING" } });

  redirect("/login?registered=1");
}

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function loginAction(formData: FormData) {
  const p = loginSchema.safeParse(Object.fromEntries(formData));
  if (!p.success) return { error: "Invalid input" };
  try {
    await signIn("credentials", { ...p.data, redirectTo: "/dashboard" });
  } catch (e) {
    if (e instanceof AuthError) return { error: "Invalid email or password" };
    throw e;
  }
}
