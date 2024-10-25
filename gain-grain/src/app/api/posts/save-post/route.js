import { NextResponse } from 'next/server';
import { savePost } from '../../../../utils/userPosts';

export async function POST(req) {
    try {
        const body = await req.json();
        const { userId, postType, postData } = body;

        await savePost(userId, postType, postData);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in save-post API:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
  }
  
export async function GET() {
    return NextResponse.json({ success: false, message: 'Method GET not allowed' }, { status: 405 });
}