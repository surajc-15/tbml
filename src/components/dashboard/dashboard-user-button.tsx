"use client";

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function DashboardUserButton() {
  const router = useRouter();

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Signed out successfully.');
    router.push('/sign-in');
    router.refresh();
  };

  return (
    <Button variant="outline" onClick={() => void signOut()}>
      Sign out
    </Button>
  );
}
