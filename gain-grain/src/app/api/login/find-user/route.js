import { NextResponse } from 'next/server';
import { findUser } from '../../../../utils/userModel';
import { signToken } from '../../../../utils/auth';

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        const result = await findUser(username, password);
        if (!result.success) {
            return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
        }

        const sessionToken = await signToken({ userId: result.user._id });

        const response = NextResponse.json({ success: true });
        response.cookies.set('session', sessionToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            expires: new Date(Date.now() + 7200000)
        });

        return response;
    } catch (error) {
        console.error('Error in find-user API:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

// Handle unsupported GET requests
export async function GET() {
    return NextResponse.json({ success: false, message: 'Method GET not allowed' }, { status: 405 });
}
