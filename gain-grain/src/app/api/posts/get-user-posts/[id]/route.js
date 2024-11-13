import { getPostById } from '../../../../../utils/userPosts';

// GET request handler to retrieve a post by ID
export async function GET(req, { params }) {
    try {
        const { id } = params; // Extract post ID from route parameters
        const post = await getPostById(id); // Fetch the post using the ID

        if (!post) {
            return new Response('Post not found', { status: 404 });
        }

        // Respond with the post data in JSON format if found
        return new Response(JSON.stringify(post), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } 
    catch (error) {
        console.error("Error fetching post:", error); // Log any errors for debugging
        return new Response('Error fetching post', { status: 500 });
    }
}