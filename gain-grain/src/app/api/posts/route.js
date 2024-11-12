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

export async function PUT(req) {
    // Proceed with fetching data for the given userId
    try {
        const body = await req.json();
        const { userId, postId, like} = body;
        const likeStatus = like ? "like" : "unlike"
        
        
        console.log(userId, postId);

        const updatedPosts = await updatePostsById(userId, postId, likeStatus);
        if (!updatedPosts) {
            return NextResponse.json({ message: 'Could not find post'});
        }
        return NextResponse.json({ message: 'Like added!', updatedPosts });
    } 
    catch (error) {
      return new Response("Error updating posts", { status: 500 });
    }
}