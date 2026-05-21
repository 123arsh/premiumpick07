'use client';

import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Header() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Premium Picks';

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
            {siteName}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
            Curated picks · Best deals
          </p>
        </motion.div>

        <ThemeToggle />
      </div>
    </header>
  );
}
