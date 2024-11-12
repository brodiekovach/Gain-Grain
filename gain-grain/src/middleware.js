import { NextResponse } from 'next/server';
import { verifyToken } from './utils/auth';

const publicRoutes = ['/login', '/register', '/login/forgot-password', '/reset-password'];
const ignoredExtensions = ['.js', '.css', '.jpeg', '.jpg', '.png', '.svg',];
const apiRoutes = ['/api/login/find-user', '/api/register/create-user', '/api/forgot-password/send-email', 
                   '/api/reset-password/validate-token', '/api/reset-password/reset-password-api', 
                   '/api/reset-password/remove-token', '/api/blogs', '/api/posts/get-posts', '/api/posts/get-followed-user-posts',
                   '/api/posts/save-posts-to-profile', '/api/profile/get-user-from-session'];

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    if (ignoredExtensions.some(ext => pathname.endsWith(ext))) {
        return NextResponse.next();
    }

    if(publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    if (apiRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    const sessionCookie = req.cookies.get('session');

    if(!sessionCookie) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    const isValidSession = await verifyToken(sessionCookie.value);

    if(!isValidSession) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}