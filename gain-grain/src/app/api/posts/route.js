import { NextResponse } from 'next/server';
import { createWorkout, findWorkoutsByUserId } from '../../../utils/userWorkout';

export async function POST(req) {
    try {
        const body = await req.json();
        const { userId, exercises } = body;

        // Use the utility function to insert the new workout into the database
        const result = await createWorkout(userId, exercises);

        return NextResponse.json({ message: 'Workout added!', result });
    } catch (error) {
        console.error('Error when adding workout:', error);
        return NextResponse.json({ success: false, message: 'Failed to save workout' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { userId } = req.query;

        const workouts = await findWorkoutsByUserId(userId);

        return NextResponse.json({ workouts });
    } catch (error) {
        console.error('Error when fetching workouts:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch workouts' }, { status: 500 });
    }
}
