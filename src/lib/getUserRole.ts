import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUserRole() {
  const authObj = await auth();
  const userId = authObj.userId;
  if (!userId) return null;

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  return dbUser?.role ?? null;
}

export default getUserRole;
