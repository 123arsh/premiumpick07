'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';

interface AdminProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  deletingId?: string | null;
}

export function AdminProductList({ products, onEdit, onDelete, deletingId }: AdminProductListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
        <p className="text-zinc-600 dark:text-zinc-400">No products yet.</p>
        <p className="mt-1 text-sm text-zinc-500">Add your first product above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover dark:border-zinc-800 dark:bg-zinc-900/80 sm:flex-row sm:items-center"
        >
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="80px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{product.name}</p>
            <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{product.hoverTitle}</p>
            {product.category && (
              <span className="mt-2 inline-block rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-medium text-brand-600 dark:text-brand-400">
                {product.category}
              </span>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" onClick={() => onEdit(product)}>
              Edit
            </Button>
            <Button
              variant="danger"
              loading={deletingId === product._id}
              onClick={() => onDelete(product._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
