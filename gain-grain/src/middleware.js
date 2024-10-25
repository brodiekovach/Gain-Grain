import { NextResponse } from 'next/server';
import { verifyToken } from './utils/auth';

const publicRoutes = ['/login', '/register', '/login/forgot-password', '/reset-password'];
const apiRoutes = ['/api/login/find-user', '/api/blogs'];
const ignoredExtensions = ['.js', '.css', '.jpeg', '.jpg', '.png', '.svg',];

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