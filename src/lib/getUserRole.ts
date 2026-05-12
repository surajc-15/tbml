import { getCurrentUser } from '@/lib/auth';

export async function getUserRole() {
  const session = await getCurrentUser();
  return session?.role ?? null;
}

export async function getUserEmail() {
  const session = await getCurrentUser();
  return session?.email ?? null;
}

export default getUserRole;
