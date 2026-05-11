import { getCurrentUser } from '@/lib/auth';

export async function getUserRole() {
  const session = await getCurrentUser();
  return session?.role ?? null;
}

export default getUserRole;
