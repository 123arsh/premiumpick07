'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SearchFilterProps {
  search: string;
  category: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function SearchFilter({
  search,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
}: SearchFilterProps) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(localSearch), 400);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search products..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-900 sm:w-48"
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </motion.div>
  );
}
