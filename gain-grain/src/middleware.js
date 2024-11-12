import { NextResponse } from 'next/server';
import { verifyToken } from './utils/auth';

const publicRoutes = ['/login', '/register', '/login/forgot-password', '/reset-password'];
const ignoredExtensions = ['.js', '.css', '.jpeg', '.jpg', '.png', '.svg'];
const apiRoutes = [
    '/api/login/find-user',
    '/api/register/create-user',
    '/api/forgot-password/send-email',
    '/api/reset-password/validate-token',
    '/api/reset-password/reset-password-api',
    '/api/reset-password/remove-token',
    '/api/blogs',
    '/api/posts/get-posts',
    '/api/posts/get-followed-user-posts',
    '/api/posts',
    '/api/posts/save-posts-to-profile',
    '/api/profile/get-user-from-session'
];

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // Allow ignored extensions to bypass middleware
    if (ignoredExtensions.some(ext => pathname.endsWith(ext))) {
        return NextResponse.next();
    }

    // Allow public routes to bypass authentication
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Allow specific API routes to bypass authentication
    if (apiRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Check for the session cookie
    const sessionCookie = req.cookies.get('session');
    if (!sessionCookie) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Verify the session token
    const isValidSession = await verifyToken(sessionCookie.value);
    if (!isValidSession) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}
