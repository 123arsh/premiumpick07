'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export function Header() {
  const { theme, toggle } = useTheme();
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

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggle}
          aria-label="Toggle theme"
          className="rounded-full p-2.5 text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          {theme === 'dark' ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </motion.button>
      </div>
    </header>
  );
}
