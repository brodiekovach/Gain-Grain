import { getBlogById } from '../../../../utils/userBlogs';

export async function GET(req, { params }) {
    try {
        const { id } = params; // Get the blog ID from the route parameters
        const blog = await getBlogById(id);

        if (!blog) {
            return new Response('Blog not found', { status: 404 });
        }

        return new Response(JSON.stringify(blog), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return new Response('Error fetching blog', { status: 500 });
    }
}
