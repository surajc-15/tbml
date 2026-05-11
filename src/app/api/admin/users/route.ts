import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, requireAdmin, normalizeLoginIdentifier } from '@/lib/auth';
import { randomUUID } from 'crypto';

type CreateUserBody = {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  bankName?: string;
  role?: 'ANALYST' | 'BANK_USER';
};

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CreateUserBody;
    const email = normalizeLoginIdentifier(body.email ?? '');
    const username = body.username ? normalizeLoginIdentifier(body.username) : '';
    const password = body.password ?? '';
    const role = body.role === 'BANK_USER' ? 'BANK_USER' : 'ANALYST';

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    if (!username) {
      return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
    }

    const existingUser = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "User"
      WHERE email = ${email} OR username = ${username}
      LIMIT 1
    `;

    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'A user with that email or username already exists.' }, { status: 409 });
    }

    const createdUser = await prisma.$queryRaw<Array<{
      id: string;
      email: string;
      username: string | null;
      bankName: string | null;
      role: string;
      createdAt: Date;
    }>>`
      INSERT INTO "User" (
        id,
        email,
        username,
        name,
        "passwordHash",
        "bankName",
        role,
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${randomUUID()},
        ${email},
        ${username},
        ${body.name?.trim() || null},
        ${hashPassword(password)},
        ${body.bankName?.trim() || null},
        ${role}::"Role",
        NOW(),
        NOW()
      )
      RETURNING id, email, username, "bankName" AS "bankName", role, "createdAt"
    `;

    return NextResponse.json({ ok: true, user: createdUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}