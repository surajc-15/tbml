import { NextResponse, type NextRequest } from 'next/server'
import { verifyAuthToken } from '@/lib/auth'

const sessionCookieName = 'tbml_session'
const protectedPrefixes = ['/dashboard', '/api/admin']

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname.startsWith(prefix))
}

export function proxy(request: NextRequest) {
  if (!isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get(sessionCookieName)?.value

  if (!sessionToken || !verifyAuthToken(sessionToken)) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
}