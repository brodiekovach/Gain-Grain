import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = cookies();
        const sessionToken = cookieStore.get('session');

        if (!sessionToken) {
            return NextResponse.json({ 
                success: false, 
                message: 'No session found' 
            }, { status: 401 });
        }

        const tokenData = await verifyToken(sessionToken.value);
        console.log('Token data:', tokenData);
        
        if (!tokenData || !tokenData.userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Invalid session' 
            }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        // Get the user document
        const user = await db.collection('users').findOne(
            { _id: new ObjectId(tokenData.userId) }
        );
        console.log('User document:', user);

        // Initialize savedPosts array if it doesn't exist
        if (!user.savedPosts) {
            await db.collection('users').updateOne(
                { _id: new ObjectId(tokenData.userId) },
                { $set: { savedPosts: [] } }
            );
            return NextResponse.json({ 
                success: true, 
                savedPosts: [] 
            });
        }

        // Fetch the actual posts
        const savedPosts = await db.collection('posts').find({
            _id: { $in: user.savedPosts.map(id => 
                typeof id === 'string' ? new ObjectId(id) : id
            )}
        }).toArray();
        console.log('Saved posts:', savedPosts);

        return NextResponse.json({ 
            success: true,
            savedPosts 
        });

    } catch (error) {
        console.error('Error fetching saved posts:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}