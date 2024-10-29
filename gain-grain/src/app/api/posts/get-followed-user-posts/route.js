import {Post} from '../../../../utils/postModels/Post';
import clientPromise from '../../../../utils/mongodb';

// Fetch all posts
const fetchFollowedUserPosts = async () => {
  try {
    const client = await clientPromise; // Ensure you have access to the client
    const db = client.db(); // Access the database
    const posts = await db
      .collection('posts')
      .find()
      .toArray();

    return { success: true, posts };
  } 
  catch (error) {
    console.error('Error fetching posts:', error);
    return { success: false, message: 'Error fetching posts' };
  }
};

// Handle GET requests
export const GET = async (req) => {
  try {
    const { success, posts, message } = await fetchFollowedUserPosts(); // Fetch all posts

    if (success) {
      return new Response(JSON.stringify(posts), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message }), { status: 500 });
    }
  } catch (error) {
    console.error("Error fetching posts:", error); // Log the error
    return new Response('Error fetching posts', { status: 500 });
  }
};

// Handle POST requests
export const POST = async (req) => {
  const { title, body, author } = await req.json(); // Get the request body

  try {
    const newPost = new Post({ title, body, author });
    await newPost.save(); // Save the new post
    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error); // Log the error
    return new Response('Error creating post', { status: 500 });
  }
};
