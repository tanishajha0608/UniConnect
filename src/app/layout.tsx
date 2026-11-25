import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniConnect: split rides with UCR students",
  description: "Find UCR students going your way and split the Uber or Lyft.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#1d4ed8" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser().catch(() => null);
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <nav className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
            <Link href={user ? "/trips" : "/"} className="text-lg font-bold text-blue-700 dark:text-blue-400">
              UniConnect
            </Link>
            <div className="flex items-center gap-4 text-sm">
              {user ? (
                <>
                  <Link href="/trips" className="hover:underline">My trips</Link>
                  <Link href="/trips/new" className="hover:underline">Post a trip</Link>
                  {isAdmin(user) && <Link href="/admin" className="hover:underline">Admin</Link>}
                  <Link href="/profile" className="hover:underline">Profile</Link>
                </>
              ) : (
                <Link href="/login" className="font-medium hover:underline">Sign in</Link>
              )}
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">{children}</main>
        <footer className="mx-auto w-full max-w-3xl px-4 py-6 text-xs text-slate-500">
          UniConnect connects verified UCR students. We don&apos;t provide rides. <Link href="/terms" className="underline">Terms and safety</Link>
        </footer>
      </body>
    </html>
  );
}
