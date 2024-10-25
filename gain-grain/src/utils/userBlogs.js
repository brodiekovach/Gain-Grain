import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

// Function to create a new blog post
export async function createBlogPost(userId, content) {
    const client = await clientPromise;
    const db = client.db();

    const blogCollection = db.collection('blogs');

    const result = await blogCollection.insertOne({
        userId: new ObjectId(userId),  
        content,
        date: new Date(),
    });

    return result;
}


