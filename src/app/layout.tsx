import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Ezlancing | Seamless Freelance Growth', description: 'An original bilingual freelance marketplace under development.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
