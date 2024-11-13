import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const { postId, userId, content } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // Get user info for the comment
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    const comment = {
      _id: new ObjectId(),
      userId: new ObjectId(userId),
      username: user.username,
      content,
      createdAt: new Date(),
    };

    // Add comment to post
    await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: comment } }
    );

    return NextResponse.json({
      success: true,
      comment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({
      success: false,
      message: 'Error adding comment'
    }, { status: 500 });
  }
} 