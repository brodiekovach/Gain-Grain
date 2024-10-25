import { NextResponse } from 'next/server';
import { findUser } from '../../../../utils/userModel';
import { signToken } from '../../../../utils/auth';

export async function POST(req) {
    try {
        // Parse request body for username and password
        const { username, password } = await req.json();

        // Check if user exists and credentials are valid
        const result = await findUser(username, password);
        if (!result.success) {
            return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
        }

        // Generate a session token for the user
        const sessionToken = await signToken({ userId: result.user._id });

        // Create response with session token as an HTTP-only cookie
        const response = NextResponse.json({ success: true });
        response.cookies.set('session', sessionToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false,
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
