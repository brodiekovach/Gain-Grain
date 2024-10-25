import { NextResponse } from 'next/server';
import { postProgressPic } from '../../../../utils/userProgressPics';

export async function POST(req) {
    try {
      const body = await req.json();
      const { userId, progressPic } = body;

      const postPic = await postProgressPic(userId, progressPic);

      if (postPic.success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, message: postPic.message }, { status: 401 });
      }
    } catch (error) {
      console.error('Error in post-progress-pic API:', error);
      return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
  }
  
export async function GET() {
  return NextResponse.json({ success: false, message: 'Method GET not allowed' }, { status: 405 });
}