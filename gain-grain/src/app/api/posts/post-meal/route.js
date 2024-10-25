import { NextResponse } from 'next/server';
import { saveMealPost } from '../../../../utils/userMeal';

export async function POST(req) {
    try {
        const body = await req.json();
        const { userId, meal } = body;

        await saveMealPost(userId, meal);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in post-meal API:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
  }
  
export async function GET() {
    return NextResponse.json({ success: false, message: 'Method GET not allowed' }, { status: 405 });
}