import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname

    if (path.startsWith('/admin') && path !== '/adminlogin') {
        const session = request.cookies.get('admin_session')
        if (!session) {
            return NextResponse.redirect(new URL('/adminlogin', request.url))
        }
    }

    return NextResponse.next()
}

export default proxy

export const config = {
    matcher: ['/admin/:path*'],
}
