import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const cookies = req.cookies;
        const sessionCookie = cookies.get('session');

        if(sessionCookie) {
            const response = NextResponse.json({ success: true, message: 'Session cookies deleted.', }, { status: 200 } );
            response.cookies.set('session', '', {
                path: '/',
                expires: new Date(Date.now()),
                httpOnly: true,
                sameSite: 'strict',
                secure: true,
            });
            
            return response;
        } else {
            return NextResponse.json({ success: false, message: 'No session cookie found' }, { status: 404 } );
        }
    } catch (error) {
        console.error('Error in delete-cookie API:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ success: false, message: 'Method GET not allowed' }, { status: 405 });
}
