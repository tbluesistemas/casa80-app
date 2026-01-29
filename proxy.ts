import { auth } from "@/auth"

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isLoginPage = nextUrl.pathname === '/login'
    const isApiRoute = nextUrl.pathname.startsWith('/api')

    // Allow API routes (including NextAuth)
    if (isApiRoute) {
        return
    }

    // If user is logged in and trying to access login page, redirect to dashboard
    if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL('/', nextUrl))
    }

    // If user is not logged in and trying to access any page except login, redirect to login
    if (!isLoggedIn && !isLoginPage) {
        return Response.redirect(new URL('/login', nextUrl))
    }

    // Allow the request to proceed
    return
})

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
}
