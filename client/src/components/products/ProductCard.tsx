'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const handleClick = () => {
    window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group cursor-pointer"
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      role="link"
      tabIndex={0}
      aria-label={`View ${product.name}`}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-shadow duration-300 group-hover:shadow-card-hover dark:bg-surface-card">
        <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading={index < 4 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/50">
            <h3 className="translate-y-4 px-4 text-center text-lg font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {product.hoverTitle}
            </h3>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h2 className="line-clamp-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 sm:text-base">
            {product.name}
          </h2>
          {product.category && (
            <span className="mt-2 inline-block w-fit rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-medium text-brand-600 dark:text-brand-400">
              {product.category}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
