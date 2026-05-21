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
    return <p className="text-zinc-500">No products yet. Add your first product above.</p>;
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <div
          key={product._id}
          className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{product.name}</p>
            <p className="truncate text-sm text-zinc-500">{product.hoverTitle}</p>
            {product.category && (
              <span className="text-xs text-brand-500">{product.category}</span>
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
