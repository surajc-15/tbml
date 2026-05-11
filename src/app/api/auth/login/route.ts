import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeLoginIdentifier, setAuthSession, verifyPassword } from '@/lib/auth';
import type { Role } from '@prisma/client';

type LoginBody = {
  identifier?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const identifier = normalizeLoginIdentifier(body.identifier ?? '');
    const password = body.password ?? '';

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const users = await prisma.$queryRaw<Array<{
      id: string;
      email: string;
      role: Role;
      username: string | null;
      name: string | null;
      bankName: string | null;
      passwordHash: string | null;
    }>>`
      SELECT
        id,
        email,
        role,
        username,
        name,
        "bankName" AS "bankName",
        "passwordHash" AS "passwordHash"
      FROM "User"
      WHERE email = ${identifier}
      LIMIT 1
    `;

    const user = users[0] ?? null;

    if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    await setAuthSession({
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      name: user.name,
      bankName: user.bankName,
    });

    return NextResponse.json({
      ok: true,
      role: user.role,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}