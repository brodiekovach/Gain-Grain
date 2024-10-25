import { NextResponse } from 'next/server';
import { followAccount, unfollowAccount } from '@/utils/userModel';

export async function POST(req) {
  try {
    const body = await req.json();
    const { user, currentUser, following } = body;

    if(!following) {
      const result = await followAccount(user, currentUser);

      if(result.success) {
        return NextResponse.json({ success: true, message: `Followed ${user.username}` });
      } else {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
    } else {
      const result = await unfollowAccount(user, currentUser);

      if(result.success) {
        return NextResponse.json({ success: true, message: `Unfollowed ${user.username}` });
      } else {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
    }
  } catch (error) {
    console.error(`Error when following ${user.username}:`, error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, message: 'Method GET not allowed.' }, { status: 405 });
}