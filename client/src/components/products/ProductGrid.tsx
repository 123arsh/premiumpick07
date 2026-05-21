'use client';

import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) return <ProductGridSkeleton />;

  if (products.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">No products found</p>
        <p className="mt-1 text-sm text-zinc-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
}
