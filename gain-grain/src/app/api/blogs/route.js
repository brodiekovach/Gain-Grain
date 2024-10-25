import { NextResponse } from 'next/server';
import { createBlogPost } from '../../../utils/userBlogs';

export async function POST(req) {
    try {
        const body = await req.json();
        const { userId, content } = body;

        const result = await createBlogPost(userId, content);

        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message }, { status: 401 });
        }

        return NextResponse.json({ success: true, message: 'Blog post added!' });
    } catch (error) {
        console.error('Error when adding blog post:', error);
        return NextResponse.json({ success: false, message: 'Failed to save blog post' }, { status: 500 });
    }
}

