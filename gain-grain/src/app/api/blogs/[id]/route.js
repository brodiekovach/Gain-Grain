import { getBlogById } from '../../../../utils/userBlogs';

// GET request handler to retrieve a blog by ID
export async function GET(req, { params }) {
    try {
        const { id } = params; // Extract blog ID from route parameters
        const blog = await getBlogById(id); // Fetch the blog using the ID

        if (!blog) {
            return new Response('Blog not found', { status: 404 });
        }

        // Respond with the blog data in JSON format if found
        return new Response(JSON.stringify(blog), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } 
    catch (error) {
        console.error("Error fetching blog:", error); // Log any errors for debugging
        return new Response('Error fetching blog', { status: 500 });
    }
}
