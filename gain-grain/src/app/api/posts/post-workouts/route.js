import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
    try {
        const { userId, title, exercises, postType, date } = await req.json();
        
        if (!userId) {
            return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        // Create the workout document
        const workoutDoc = {
            userId: new ObjectId(userId),
            title,
            exercises: exercises.map(exercise => ({
                name: exercise.name,
                reps: Number(exercise.reps),
                sets: Number(exercise.sets)
            })),
            date
        };

        // Insert into workouts collection
        const workoutResult = await db.collection('workouts').insertOne(workoutDoc);

        // Create the post document
        const postDoc = {
            userId: new ObjectId(userId),
            title,
            exercises: exercises.map(exercise => ({
                name: exercise.name,
                reps: Number(exercise.reps),
                sets: Number(exercise.sets)
            })),
            postType,
            date,
            workoutId: workoutResult.insertedId, // Reference to the workout document
            likeCount: [],
            comments: []
        };

        // Insert into posts collection
        const postResult = await db.collection('posts').insertOne(postDoc);

        return NextResponse.json({
            success: true,
            workout: workoutResult,
            post: postResult
        });

    } catch (error) {
        console.error('Error creating workout post:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
} 