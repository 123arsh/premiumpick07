'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/services/api';
import { getAdminBasePath } from '@/lib/constants';

const TOKEN_KEY = 'admin_token';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

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
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <h1 className="text-xl font-semibold text-white">Admin access</h1>
        <p className="mt-1 text-sm text-zinc-400">Authorized personnel only</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <Input
            name="username"
            label="Username"
            required
            autoComplete="username"
            className="dark:bg-zinc-800"
          />
          <Input
            name="password"
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            className="dark:bg-zinc-800"
          />
          <Button type="submit" className="w-full" loading={loading}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
