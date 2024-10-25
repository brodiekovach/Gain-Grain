import { NextResponse } from 'next/server';
import { createBlogPost } from '../../../utils/userBlogs';

// POST request handler to create a new blog post
export async function POST(req) {
    try {
        const body = await req.json(); // Parse request body to JSON
        const { userId, content } = body; // Destructure userId and content from the body

        const result = await createBlogPost(userId, content); // Attempt to create the blog post

        if (!result.success) {
            // Return 401 if blog creation fails
            return NextResponse.json({ success: false, message: result.message }, { status: 401 });
        }

        // Respond with success if blog post was created
        return NextResponse.json({ success: true, message: 'Blog post added!' });
    } 
    catch (error) {
        console.error('Error when adding blog post:', error); // Log any errors for debugging
        // Respond with 500 if there's an internal server error
        return NextResponse.json({ success: false, message: 'Failed to save blog post' }, { status: 500 });
    }
}