import { NextResponse } from 'next/server';
import { createWorkout, findWorkoutsByUserId } from '../../../utils/userWorkout';
import { updatePostsById } from '../../../utils/userPosts';

export async function POST(req) {
    try {
        const body = await req.json();
        const { userId, exercises } = body;

        // Use the utility function to insert the new workout into the database
        const result = await createWorkout(userId, exercises);

        return NextResponse.json({ message: 'Workout added!', result });
    } 
    catch (error) {
        console.error('Error when adding workout:', error);
        return NextResponse.json({ success: false, message: 'Failed to save workout' }, { status: 500 });
    }
}

export async function GET(req) {
    const { userId } = req.query || {};
  
    // Check if userId is defined
    if (!userId) {
      return new Response("Missing userId in query", { status: 400 });
    }
  
    // Proceed with fetching data for the given userId
    try {
        const { userId } = req.query;

        const workouts = await findWorkoutsByUserId(userId);

        return NextResponse.json({ workouts });
    } 
    catch (error) {
      return new Response("Error fetching workouts", { status: 500 });
    }
}  

// Update post with some sort of information (add a like, add a comment, etc.)
export async function PUT(req) {
    try {
        const body = await req.json();
        const { userId, postId, like, comment } = body;

        // Validate that userId and postId are provided
        if (!userId || !postId) {
            return NextResponse.json({ message: 'Missing userId or postId' }, { status: 400 });
        }

        let actionType;
        let data;

        // Handle like/unlike functionality
        if (like !== undefined) {
            actionType = like ? "like" : "unlike";
        } 
        // Handle adding a comment
        else if (comment) {
            actionType = "comment";
            data = { comment };
        } else {
            return NextResponse.json({ message: 'No valid action specified' }, { status: 400 });
        }

        const result = await updatePostsById(userId, postId, actionType, data);

        if (!result.success) {
            return NextResponse.json({ message: result.message }, { status: 404 });
        }
        return NextResponse.json({ message: result.message });
    } 
    catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json({ message: 'Error updating post' }, { status: 500 });
    }
}
