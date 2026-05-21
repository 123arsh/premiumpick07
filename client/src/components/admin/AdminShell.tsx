'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';

interface AdminShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onLogout?: () => void;
  showLogout?: boolean;
}

export function AdminShell({
  children,
  title = 'Admin',
  subtitle,
  onLogout,
  showLogout = false,
}: AdminShellProps) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Premium Picks';

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-[var(--bg)]/80 backdrop-blur-xl dark:border-zinc-800/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex flex-col">
            <Link href="/" className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
              {siteName}
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
              {subtitle || `${title} · Curated picks`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {showLogout && onLogout && (
              <Button variant="ghost" onClick={onLogout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

export function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
    </div>
  );
}
