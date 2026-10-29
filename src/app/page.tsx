import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-extrabold text-brand-indigo">
        ezlancing<span className="text-brand-lime">.</span>
      </h1>
      <p className="text-slate-600 mt-2">MENA&apos;s freelance marketplace</p>
      <div className="mt-8 flex gap-3">
        <Link href="/projects" className="bg-brand-indigo text-white px-5 py-3 rounded-lg font-bold">Browse projects</Link>
        <Link href="/register" className="bg-brand-lime text-brand-dark-indigo px-5 py-3 rounded-lg font-bold">Get started</Link>
      </div>
    </main>
  );
}
