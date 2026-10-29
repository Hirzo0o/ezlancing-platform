export const instant = false;

import { Suspense } from "react";
import Link from "next/link";
import { loginAction } from "@/server/actions/auth";

async function LoginContent({ searchParams }: { searchParams: Promise<{ registered?: string }> }) {
  const sp = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-ice px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
        <h1 className="text-2xl font-extrabold text-brand-indigo">Sign in</h1>
        {sp.registered && (
          <p className="mt-3 text-sm bg-emerald-50 text-emerald-800 rounded-lg px-3 py-2">
            Account created. Please sign in.
          </p>
        )}
        <form action={async (formData: FormData) => { "use server"; await loginAction(formData); }} className="mt-6 space-y-4">
          <input name="email" type="email" required placeholder="Email"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo" />
          <input name="password" type="password" required placeholder="Password"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo" />
          <button type="submit" className="w-full bg-brand-indigo text-white font-bold py-3 rounded-lg">Sign in</button>
        </form>
        <p className="text-xs text-slate-500 mt-6 text-center">
          New here? <Link href="/register" className="font-bold text-brand-indigo">Create account</Link>
        </p>
      </div>
    </main>
  );
}


export default function LoginPage({ searchParams }: {
  searchParams: Promise<{ registered?: string }>;
}) {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-brand-ice px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
          <p className="text-brand-indigo">Loading sign in...</p>
        </div>
      </main>
    }>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
