"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const payload = (await response.json()) as { error?: string; redirectTo?: string };

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to sign in.');
      }

      toast.success('Signed in successfully.');
      router.push(payload.redirectTo || '/dashboard');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign in</h2>
        <p className="text-slate-500">Enter your credentials to access the console.</p>
      </div>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label htmlFor="identifier" className="text-sm font-semibold text-slate-700">Email Address</label>
          <Input
            id="identifier"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="admin@bank.com"
            autoComplete="email"
            className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-sky-500 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
            <a href="#" className="text-sm font-medium text-sky-600 hover:text-sky-500">Forgot password?</a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-sky-500 transition-all"
            required
          />
        </div>
        <Button className="w-full h-12 text-base font-semibold bg-sky-600 hover:bg-sky-700 transition-colors mt-2" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in to Console'}
        </Button>
      </form>
    </div>
  );
}