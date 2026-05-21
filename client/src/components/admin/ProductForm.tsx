'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';

interface ProductFormProps {
  initial?: Product | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ProductForm({ initial, onSubmit, onCancel, loading }: ProductFormProps) {
  const [preview, setPreview] = useState<string | null>(initial?.imageUrl || null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get('image') as File;
    if (!initial && (!file || file.size === 0)) {
      return;
    }
    if (file?.size === 0) formData.delete('image');
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium">Product image</label>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {preview && (
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl">
              <Image src={preview} alt="Preview" fill className="object-cover" />
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFile}
            className="text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-600"
          />
        </div>
        {!initial && <p className="mt-1 text-xs text-zinc-500">Required for new products</p>}
      </div>

      <Input name="name" label="Visible name" defaultValue={initial?.name} required />
      <Input name="hoverTitle" label="Hover title" defaultValue={initial?.hoverTitle} required />
      <Input
        name="affiliateLink"
        label="Affiliate link"
        type="url"
        defaultValue={initial?.affiliateLink}
        required
      />
      <Input name="category" label="Category (optional)" defaultValue={initial?.category} />
      <Textarea name="description" label="Description (optional)" defaultValue={initial?.description} />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {initial ? 'Update product' : 'Add product'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
