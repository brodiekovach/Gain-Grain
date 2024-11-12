import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { postId } = await request.json();
        if (!postId) {
            return NextResponse.json({ 
                success: false, 
                message: 'No postId provided' 
            }, { status: 400 });
        }

        // Get and verify session token
        const cookieStore = cookies();
        const sessionToken = cookieStore.get('session');

        if (!sessionToken) {
            return NextResponse.json({ 
                success: false, 
                message: 'No session found' 
            }, { status: 401 });
        }

        const tokenData = await verifyToken(sessionToken.value);
        
        if (!tokenData || !tokenData.userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Invalid session' 
            }, { status: 401 });
        }

        // Save the post using the userId from the verified token
        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(tokenData.userId) },
            { $addToSet: { savedPosts: postId } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ 
                success: false, 
                message: 'User not found' 
            }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true,
            message: 'Post saved successfully' 
        });

    } catch (error) {
        console.error('Error in save-posts-to-profile:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}