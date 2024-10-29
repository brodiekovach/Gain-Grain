import { getPostById } from '../../../../../utils/userPosts';
import clientPromise from '../../../../../utils/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// GET request handler to retrieve a post by ID
export async function GET(req, { params }) {
    try {
        const { id } = params; // Extract post ID from route parameters
        //const post = await getPostById(id); // Fetch the post using the ID
        console.log("ID", id);
        const client = await clientPromise;
        const db  = client.db();

        try {
            const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

            if(!user)  {
                return NextResponse.json({ success: false, message: 'Error retrieving user' });
            }

            const followingIds = user.following.map((id)=> new ObjectId(id));
            console.log("Following ids", followingIds);
            const posts = await db
                .collection('posts')
                .find({userId : {$in : followingIds}})
                .toArray();
            
            if(!posts)  {
                return NextResponse.json({ success: false, message: 'Error retrieving post' });
            }

            return NextResponse.json({ success: true, posts});
        }
        catch(error) {
            console.error('Error retrieving user: ', error);
            return NextResponse.json({ success: false, message: 'Error retrieving user' });
        }
        // if (!post) {
        //     return new Response('Post not found', { status: 404 });
        // }

        // Respond with the post data in JSON format if found
        // return new Response(JSON.stringify(post), {
        //     status: 200,
        //     headers: { 'Content-Type': 'application/json' },
        // });
    } 
    catch (error) {
        console.error("Error fetching post:", error); // Log any errors for debugging
        return new Response('Error fetching post', { status: 500 });
    }
}