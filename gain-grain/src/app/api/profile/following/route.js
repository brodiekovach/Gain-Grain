import { NextResponse } from 'next/server';
import { isFollowing } from '@/utils/userModel';

export async function POST(req) {
  try {
    const body = await req.json();
    const { currentUser, user } = body;

    const result = await isFollowing(currentUser, user);

    return NextResponse.json({ following: result.following });
  } catch (error) {
    console.error(`Error when checking following status:`, error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, message: 'Method GET not allowed.' }, { status: 405 });
}