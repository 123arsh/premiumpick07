'use client';

import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary:
    'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25',
  secondary:
    'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  ghost:
    'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
};

export function Button({
  variant = 'primary',
  loading,
  children,
  className = '',
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <motion.div whileTap={{ scale: 0.98 }} className="inline-flex">
      <button
        type={type}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        )}
        {children}
      </button>
    </motion.div>
  );
}
