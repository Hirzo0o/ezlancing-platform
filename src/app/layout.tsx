import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = { title: "ezlancing", description: "MENA freelance marketplace" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={inter.variable}>
      <body className="bg-slate-50 font-sans text-brand-dark antialiased">{children}</body>
    </html>
  );
}
