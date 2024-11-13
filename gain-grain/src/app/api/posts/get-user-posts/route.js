import { NextResponse } from 'next/server';
import { fetchUserPosts } from '@/utils/userPosts';

export async function POST(req) {
    try {
        const { userId } = await req.json();

        const result = await fetchUserPosts(userId);
        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message });
        }

        return NextResponse.json({ success: true, posts: result.posts }, { status: 200 });
    } catch (error) {
        console.error('Error in get-user-posts API:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ success: false, message: 'Method GET not allowed' }, { status: 405 });
}