import clientPromise from './mongodb'; 
import { NextResponse } from 'next/server';
import { Post, Blog, MealPost, ProgressPic, Workout } from './postModels/Post'

export const savePost = async(userId, postType, postData) => {
  const client = await clientPromise;
  const db = client.db();

  let newPost;

  try {
    switch(postType) {
      case 'Blog':
        newPost = new Blog({ 
          userId, 
          postType: "Blog",
          content: postData.content,
          date: postData.date
        });
        break;

      case 'Meal':
        newPost = new MealPost({ 
          userId, 
          postType: "Meal",
          meal: postData.meal,
          date: postData.date
        });
        break;

      case 'ProgressPic':
        newPost = new ProgressPic({
          userId,
          postType: "ProgressPic",
          progressPic: postData.progressPic,
          date: postData.date
        });
        break;

      case 'Workout':
        newPost = new Workout({
          userId, 
          postType: "Workout",
          title: postData.title,
          exercises: postData.exercises,
          date: postData.date
        });
        break;

      default:
        return NextResponse.json({ success: false, message: 'postType does not exist' });
    }

    await db.collection('posts').insertOne(newPost);

    return NextResponse.json({ success: true, message: 'Post saved successfully.', post: newPost });
  } catch(error) {
    console.error('Error saving post:', error);
    return NextResponse.json({ success: false, message: 'Error saving post.' });
  }
}

export const fetchPosts = async(userId) => {
  try {
    const client = await clientPromise;
    const db = client.db();

    const posts = await db.collection('posts').findAll({ userId });

    return { success: true, posts };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { success: false, message: 'Error fetching posts' };
  }
};