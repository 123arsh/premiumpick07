'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { adminApi } from '@/services/api';
import { getAdminBasePath } from '@/lib/constants';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Premium Picks';
  const adminBase = getAdminBasePath();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await adminApi.forgotPassword(
        form.get('username') as string,
        form.get('resetSecret') as string
      );
      toast.success('Verified — set your new password');
      router.push(`${adminBase}/reset?token=${encodeURIComponent(res.data.resetToken)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Recovery failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight">{siteName}</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Forgot password</p>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-card dark:border-zinc-800 dark:bg-zinc-900/80">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Enter your admin username and the recovery secret configured on the server
            (<code className="text-xs">ADMIN_RESET_SECRET</code> on Render).
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <Input name="username" label="Username" required autoComplete="username" />
            <Input
              name="resetSecret"
              label="Recovery secret"
              type="password"
              required
              autoComplete="off"
            />
            <Button type="submit" className="w-full" loading={loading}>
              Continue
            </Button>
          </form>

          <p className="mt-6 text-center text-sm">
            <Link href={adminBase} className="text-brand-500 hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
