import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';

// API Route to search exercises by name
export async function GET(request) {
  const client = await clientPromise;
  const db = client.db('test');
  const exercisesCollection = db.collection('exercises');

  // Extract the search query from the request URL
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get('q') || ''; // Default to empty string if no query provided

  // Search exercises by name, case-insensitive
  const exercises = await exercisesCollection
    .find({ name: { $regex: query, $options: 'i' } }) // Match based on 'name' field using regex
    .toArray(); // Convert results to an array

  // Respond with the matched exercises in JSON format
  return NextResponse.json(exercises);
}
