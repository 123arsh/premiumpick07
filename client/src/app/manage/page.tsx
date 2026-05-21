'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { adminApi } from '@/services/api';
import { getAdminBasePath } from '@/lib/constants';

const TOKEN_KEY = 'admin_token';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Premium Picks';

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setChecking(false);
      return;
    }
    adminApi
      .me(token)
      .then(() => router.replace(`${getAdminBasePath()}/dashboard`))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setChecking(false);
      });
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await adminApi.login(
        form.get('username') as string,
        form.get('password') as string
      );
      localStorage.setItem(TOKEN_KEY, res.data.token);
      toast.success('Welcome back');
      router.push(`${getAdminBasePath()}/dashboard`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {siteName}
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Admin access only</p>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-card dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Sign in</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Authorized personnel only
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <Input name="username" label="Username" required autoComplete="username" />
            <Input
              name="password"
              label="Password"
              type="password"
              required
              autoComplete="current-password"
            />
            <Button type="submit" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
