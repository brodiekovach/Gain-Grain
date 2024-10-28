import { NextResponse } from 'next/server';
import { removeNotification } from '@/utils/userModel';

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, notif } = body;

    const result = await removeNotification(userId, notif);

    if(result.success) {
        return NextResponse.json({ success: true, result: result.notifications });
    } else {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error(`Error when removing notification`, error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, message: 'Method GET not allowed.' }, { status: 405 });
}