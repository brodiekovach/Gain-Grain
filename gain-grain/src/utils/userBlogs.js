import clientPromise from './mongodb';
import { Blog } from './postModels/Post'

export async function createBlogPost(userId, content) {
    const client = await clientPromise;
    const db = client.db();

    try {
        const newBlog = new Blog({
            userId,
            content,
            date: new Date(),
        })

        await db.collection('blogs').insertOne(newBlog);

        return { success: true, message: 'Blog post saved.' };
    } catch (error) {
        console.error('Error saving blog post: ', error);
        return { success: false, message: 'Error saving blog post.' };
    }
};