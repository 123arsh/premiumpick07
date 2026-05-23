'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { adminApi } from '@/services/api';
import { getAdminBasePath } from '@/lib/constants';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [loading, setLoading] = useState(false);
  const adminBase = getAdminBasePath();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Premium Picks';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error('Missing reset token. Start from forgot password again.');
      return;
    }

    setLoading(true);
    const form = new FormData(e.currentTarget);
    const newPassword = form.get('newPassword') as string;
    const confirmPassword = form.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await adminApi.resetPassword({ token, newPassword, confirmPassword });
      toast.success('Password reset! Sign in with your new password.');
      router.push(adminBase);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Reset failed');
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
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Set new password</p>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-card dark:border-zinc-800 dark:bg-zinc-900/80">
          {!token ? (
            <p className="text-sm text-red-500">
              Invalid or expired link.{' '}
              <Link href={`${adminBase}/forgot`} className="text-brand-500 hover:underline">
                Request again
              </Link>
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                name="newPassword"
                label="New password"
                type="password"
                required
                autoComplete="new-password"
              />
              <Input
                name="confirmPassword"
                label="Confirm new password"
                type="password"
                required
                autoComplete="new-password"
              />
              <Button type="submit" className="w-full" loading={loading}>
                Save new password
              </Button>
            </form>
          )}

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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
