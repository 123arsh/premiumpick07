'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProductForm } from '@/components/admin/ProductForm';
import { AdminProductList } from '@/components/admin/AdminProductList';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { adminApi } from '@/services/api';
import { getAdminBasePath } from '@/lib/constants';
import type { Product } from '@/types';

const TOKEN_KEY = 'admin_token';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [username, setUsername] = useState('');

  const loadProducts = useCallback(async (t: string, q?: string) => {
    try {
      const res = await adminApi.getProducts(t, q);
      setProducts(res.data.products);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load');
    }
  }, []);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) {
      router.replace(getAdminBasePath());
      return;
    }
    setToken(t);
    adminApi
      .me(t)
      .then((res) => {
        setUsername(res.data.admin.username);
        return loadProducts(t);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        router.replace(getAdminBasePath());
      })
      .finally(() => setLoading(false));
  }, [router, loadProducts]);

  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => loadProducts(token, search), 400);
    return () => clearTimeout(timer);
  }, [search, token, loadProducts]);

  const handleLogout = async () => {
    if (token) {
      try {
        await adminApi.logout(token);
      } catch {
        /* ignore */
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    router.replace(getAdminBasePath());
  };

  const handleCreate = async (formData: FormData) => {
    if (!token) return;
    setFormLoading(true);
    try {
      await adminApi.createProduct(token, formData);
      toast.success('Product added');
      setShowForm(false);
      await loadProducts(token, search);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!token || !editing) return;
    setFormLoading(true);
    try {
      await adminApi.updateProduct(token, editing._id, formData);
      toast.success('Product updated');
      setEditing(null);
      setShowForm(false);
      await loadProducts(token, search);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Delete this product?')) return;
    setDeletingId(id);
    try {
      await adminApi.deleteProduct(token, id);
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <p className="text-sm text-zinc-400">Signed in as {username}</p>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dark:bg-zinc-900 sm:max-w-xs"
          />
          {!showForm && !editing && (
            <Button onClick={() => setShowForm(true)}>+ Add product</Button>
          )}
        </div>

        {(showForm || editing) && (
          <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 text-lg font-medium">
              {editing ? 'Edit product' : 'New product'}
            </h2>
            <ProductForm
              initial={editing}
              onSubmit={editing ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
              loading={formLoading}
            />
          </div>
        )}

        <AdminProductList
          products={products}
          onEdit={(p) => {
            setEditing(p);
            setShowForm(false);
          }}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      </main>
    </div>
  );
}
