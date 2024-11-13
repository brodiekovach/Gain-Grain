import clientPromise from './mongodb';
import { NextResponse } from 'next/server';
import { Blog, MealPost, ProgressPic, Workout } from './postModels/Post'
import { ObjectId } from 'mongodb';
import { getUserById } from './userModel';

export const savePost = async (userId, postType, postData) => {
    const client = await clientPromise;
    const db = client.db();

    let newPost;

    try {
        switch (postType) {
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
    } catch (error) {
        console.error('Error saving post:', error);
        return NextResponse.json({ success: false, message: 'Error saving post.' });
    }
}

export const fetchPosts = async (userId) => {
    try {

        const client = await clientPromise;
        const db = client.db();

        const posts = await db.collection('posts').findAll({ userId });

        return { success: true, posts };
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        return { success: false, message: 'Error fetching posts' };
    }
};

export const fetchFollowedUserPosts = async (userId) => {
    try {
        const client = await clientPromise;
        const db = client.db();

        const response = await getUserById(userId);

        if(!response.success) {
            return { success: false, message: 'Error: ' + response.message }
        }

        const userFollowing = response.user.following;

        if (!userFollowing || userFollowing.length === 0) {
            return { success: false, message: 'User is not following anyone' };
        }

        const followingIds = userFollowing.map(id => new ObjectId(id));

        const posts = await db.collection('posts').find({ userId: { $in: followingIds } }).toArray();

        if (posts.length === 0) {
            return { success: false, message: 'No posts found for followed users' };
        }

        // reverse posts to get most recent posts first
        posts.reverse();

        return { success: true, posts };
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        return { success: false, message: 'Error fetching posts' };
    }
}

export const fetchUserPosts = async (userId) => {
    const client = await clientPromise;
    const db = client.db();

    try {
        const userPosts = await db.collection('posts').find({ userId }).toArray();

        if(userPosts.length === 0) {
            return { success: false, message: 'No posts found for user' };
        }

        return { success: true, posts: userPosts };
    }
    catch (error) {
        console.error('Error fetching post:', error);
        return { success: false, message: 'Error fetching post.' };
    }
}

export const getPostById = async (id) => {
    console.log("User ID", userId);
    const client = await clientPromise;
    const db = client.db();
    const postCollection = db.collection('posts');

    try {
        const blog = await postCollection.findOne({ _id: new ObjectId(id) });
        return blog || { success: false, message: 'Post not found.' };
    }
    catch (error) {
        console.error('Error fetching post:', error);
        return { success: false, message: 'Error fetching post.' };
    }
};

export const updatePostsById = async (userId, postId, likeStatus) => {
    const client = await clientPromise;
    const db = client.db();
    const postCollection = db.collection('posts');
    try {
        let update;
        if (likeStatus === "like") {
            update = { $addToSet: { likeCount: userId } };
            console.log("Liked:: ", likeStatus);
        }
        else {
            update = { $pull: { likeCount: userId } };
            console.log("Liked:: ", likeStatus);
        }
        const blog = await postCollection.updateOne({ _id: new ObjectId(postId) }, update);
        return blog || { success: false, message: 'Post not found.' };
    }
    catch (error) {
        console.error('Error fetching post:', error);
        return { success: false, message: 'Error fetching post.' };
    }
};