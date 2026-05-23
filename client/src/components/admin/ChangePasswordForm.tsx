'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/services/api';

interface ChangePasswordFormProps {
  token: string;
  onSuccess?: () => void;
}

export function ChangePasswordForm({ token, onSuccess }: ChangePasswordFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      await adminApi.changePassword(token, {
        currentPassword: form.get('currentPassword') as string,
        newPassword,
      });
      toast.success('Password updated');
      e.currentTarget.reset();
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="currentPassword"
        label="Current password"
        type="password"
        required
        autoComplete="current-password"
      />
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
      <Button type="submit" loading={loading}>
        Update password
      </Button>
    </form>
  );
}
