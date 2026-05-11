"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
  createdBy: string;
};

export function AdminUserForm({ createdBy }: Props) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bankName, setBankName] = useState('');
  const [role, setRole] = useState<'ANALYST' | 'BANK_USER'>('ANALYST');

  const resetForm = () => {
    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setBankName('');
    setRole('ANALYST');
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password, bankName, role }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to create user.');
      }

      toast.success('Bank user created successfully.');
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Bank User</CardTitle>
        <CardDescription>Register analyst or bank-user accounts from the admin console. Created by {createdBy}.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="name">Full name</label>
            <Input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Amina Khan" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="bankName">Bank name</label>
            <Input id="bankName" value={bankName} onChange={(event) => setBankName(event.target.value)} placeholder="First Gulf Trade Bank" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="analyst@bank.com" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="username">Username</label>
            <Input id="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="analyst.user" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="password">Temporary password</label>
            <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Set a password" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <Select value={role} onValueChange={(value) => setRole(value as 'ANALYST' | 'BANK_USER')}>
              <SelectTrigger>
                <SelectValue placeholder="Choose role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ANALYST">Analyst</SelectItem>
                <SelectItem value="BANK_USER">Bank User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating user...' : 'Create user'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}