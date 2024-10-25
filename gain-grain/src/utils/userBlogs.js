import mongoose from 'mongoose';
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

const blogSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true },
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

// Function to create a new blog post
export async function createBlogPost(userId, content) {
    const client = await clientPromise;
    const db = client.db();
    const blogCollection = db.collection('blogs');

    try {
        // Create and insert the new blog post
        const newBlog = {
            userId: new ObjectId(userId),
            content,
            date: new Date(),
        };
        
        const result = await blogCollection.insertOne(newBlog);
        return { success: true, message: 'Blog post saved.', result };
    } catch (error) {
        console.error('Error saving blog post:', error);
        return { success: false, message: 'Error saving blog post.' };
    }
}

// Function to retrieve a blog post by its ID
export async function getBlogById(blogId) {
    const client = await clientPromise;
    const db = client.db();
    const blogCollection = db.collection('blogs');

    try {
        const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });
        return blog || { success: false, message: 'Blog not found.' };
    } catch (error) {
        console.error('Error fetching blog:', error);
        return { success: false, message: 'Error fetching blog.' };
    }
}
