import Link from "next/link";
import { registerAction } from "@/server/actions/auth";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-ice px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
        <h1 className="text-2xl font-extrabold text-brand-indigo">Create your account</h1>
        <p className="text-sm text-slate-500 mt-1">Join MENA&apos;s freelance marketplace.</p>
        <form action={async (formData: FormData) => { "use server"; await registerAction(formData); }} className="mt-6 space-y-4">
          <input name="name" required minLength={2} placeholder="Full name"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo" />
          <input name="email" type="email" required placeholder="Email"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo" />
          <input name="password" type="password" required minLength={8} placeholder="Password (min 8 chars)"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo" />
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2.5 text-sm cursor-pointer has-[:checked]:border-brand-indigo has-[:checked]:bg-brand-ice">
              <input type="radio" name="role" value="CLIENT" defaultChecked /> Client
            </label>
            <label className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2.5 text-sm cursor-pointer has-[:checked]:border-brand-indigo has-[:checked]:bg-brand-ice">
              <input type="radio" name="role" value="FREELANCER" /> Freelancer
            </label>
          </div>
          <button type="submit" className="w-full bg-brand-lime text-brand-dark-indigo font-bold py-3 rounded-lg hover:bg-brand-bright-lime">
            Create account
          </button>
        </form>
        <p className="text-xs text-slate-500 mt-6 text-center">
          Have an account? <Link href="/login" className="font-bold text-brand-indigo">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
