'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProductForm } from '@/components/admin/ProductForm';
import { AdminProductList } from '@/components/admin/AdminProductList';
import { AdminShell, AdminLoading } from '@/components/admin/AdminShell';
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

  if (loading) return <AdminLoading />;

  return (
    <AdminShell
      title="Dashboard"
      subtitle={`Signed in as ${username}`}
      showLogout
      onLogout={handleLogout}
    >
      <section className="mb-8">
        <h2 className="font-display text-2xl font-normal tracking-tight sm:text-3xl">
          Manage products
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Add, edit, or remove affiliate products for your storefront.
        </p>
      </section>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12"
          />
        </div>
        {!showForm && !editing && (
          <Button onClick={() => setShowForm(true)}>+ Add product</Button>
        )}
      </div>

      {(showForm || editing) && (
        <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-card dark:border-zinc-800 dark:bg-zinc-900/80">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {editing ? 'Edit product' : 'New product'}
          </h3>
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
    </AdminShell>
  );
}
