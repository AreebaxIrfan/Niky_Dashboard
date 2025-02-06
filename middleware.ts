import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const rolePermissions: Record<string, string[]> = {
  '/admin': ['admin'],
  '/admin/products': ['admin', 'productManager'],
  '/orders': ['admin', 'shipmentManager'],
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const protectedPaths = Object.keys(rolePermissions)
  
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const token = await getToken({ req: request })
    const allowedRoles = rolePermissions[Object.keys(rolePermissions)
      .find(key => pathname.startsWith(key)) || '']

    if (!token || !allowedRoles?.includes(token.role as string)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*'],
}