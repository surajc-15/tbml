import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import type { Role } from '@prisma/client';

const SESSION_COOKIE = 'tbml_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const PASSWORD_ITERATIONS = 120000;
const PASSWORD_LENGTH = 32;
const PASSWORD_DIGEST = 'sha256';

type JwtHeader = {
  alg: 'HS256';
  typ: 'JWT';
};

export type AuthSession = {
  sub: string;
  email: string;
  role: Role;
  username?: string | null;
  name?: string | null;
  bankName?: string | null;
  exp: number;
  iat: number;
};

function getAuthSecret() {
  return process.env.AUTH_SECRET || process.env.SESSION_SECRET || 'tbml-dev-secret-change-me';
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function encodeJwtPart(value: unknown) {
  return encodeBase64Url(JSON.stringify(value));
}

function signJwt(payload: AuthSession) {
  const header: JwtHeader = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = encodeJwtPart(header);
  const encodedPayload = encodeJwtPart(payload);
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac('sha256', getAuthSecret()).update(signingInput).digest('base64url');
  return `${signingInput}.${signature}`;
}

export function verifyAuthToken(token: string): AuthSession | null {
  const [encodedHeader, encodedPayload, signature] = token.split('.');

  if (!encodedHeader || !encodedPayload || !signature) {
    return null;
  }

  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expected = createHmac('sha256', getAuthSecret()).update(signingInput).digest();
  const actual = Buffer.from(signature, 'base64url');

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as AuthSession;

    if (!payload.sub || !payload.email || !payload.role || typeof payload.exp !== 'number' || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_LENGTH, PASSWORD_DIGEST).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':');

  if (!salt || !hash) {
    return false;
  }

  const candidate = pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_LENGTH, PASSWORD_DIGEST).toString('hex');
  const expected = Buffer.from(hash, 'hex');
  const actual = Buffer.from(candidate, 'hex');

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function normalizeLoginIdentifier(value: string) {
  return value.trim().toLowerCase();
}

export function createAuthToken(session: Omit<AuthSession, 'exp' | 'iat'>) {
  return signJwt({
    ...session,
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS,
  });
}

export async function setAuthSession(session: Omit<AuthSession, 'exp' | 'iat'>) {
  const token = createAuthToken(session);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN' ? user : null;
}

export function createRandomPassword(length = 16) {
  return randomBytes(length).toString('base64url');
}

export function getDefaultAuthRedirect(role?: Role) {
  return role === 'ADMIN' ? '/dashboard' : '/dashboard';
}

export type AuthenticatedUser = AuthSession;