import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  numFollowers: { type: Number, required: true },
  numFollowing: { type: Number, required: true },
  followers: { type: [String], required: true },
  following: { type: [String], required: true },
  bio: { type: String, default: "" },
  profilePic: { type: String, default: "" },
  notifications: { type: [String] },
});

const tokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  reset_token: { type: String, required: true },
  token_expiry: { type: Date, required: true }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

const Token = mongoose.models.Token || mongoose.model("Token", tokenSchema);

async function createTokenTTLIndex() {
  const client = await clientPromise;
  const db = client.db();
  await db.collection('tokens').createIndex({ token_expiry: 1 }, { expireAfterSeconds: 0 });
}

export const createAndSaveUser = async (name, email, username, password) => {
  const client = await clientPromise;
  const db = client.db();

  try {
    const existingEmail = await db.collection('users').findOne({ email });
    if (existingEmail) {
      return { success: false, message: 'Email already in use.' };
    }

    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return { success: false, message: 'Username already in use.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = new User({
      name: name,
      email: email,
      username: username,
      password: hashedPassword,
      numFollowers: 0,
      numFollowing: 0,
      bio: "",
      profilePic: "",
    });

    const result = await db.collection('users').insertOne(newUser);
  
    return {success: true, message: 'User registered successfully.', userId: result.insertedId };
  } catch (error) {
    console.error('Error creating user: ', error);
    return { success: false, message: 'Error creating user.' };
  }
};

export const findUser = async (username, password) => {
  const client = await clientPromise;
  const db = client.db();

  try {
    const user = await db.collection('users').findOne({ username });

    if (!user) {
      return { success: false, message: 'Username or password is incorrect.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return { success: false, message: 'Username or password is incorrect.' };
    }
    

    return { success: true, message: 'Login successful', user };
  } catch (error) {
    console.error('Error when finding user: ', error);
    return { success: false, message: 'Error when finding user' };
  }
};

export const findUserByEmail = async (email) => {
  const client = await clientPromise;
  const db = client.db();

  try {
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return { success: false, message: 'Could not find a user with that email.' };
    }

    return { success: true, message: 'Found user with that email.'};
  } catch (error) {
    console.error('Error when finding user: ', error);
    return { success: false, message: 'Error when finding user' };
  }
};

export const findUserByUsername = async (username) => {
  const client = await clientPromise;
  const db = client.db();

  try {
    const user = await db.collection('users').findOne({ username });

    if (!user) {
      return { success: false, message: 'Could not find a user with that username.' };
    }

    return { success: true, message: 'Found user with that username.'};
  } catch (error) {
    console.error('Error when finding user: ', error);
    return { success: false, message: 'Error when finding user' };
  }
};

export const resetPassword = async(email, newPassword) => {
  const client = await clientPromise;
  const db = client.db();

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await db.collection('users').updateOne(
      { email: email },
      { $set: { password: hashedPassword } },
    );

    if (updatedUser.matchedCount === 0) {
      return { success: false, message: 'No user found with the provided email.' };
    } else if (updatedUser.modifiedCount === 0) {
      return { success: false, message: 'User found but password not changed.' };
    }

    return { success: true, message: 'Password updated successfully.' };
  } catch(error) {
    console.error('Error updating password:', error);
    return { success: false, message: 'Error resetting password.' };
  }
}

export const generateToken = async (email) => {
  const client = await clientPromise;
  const db = client.db();

  await createTokenTTLIndex();

  try {
    const reset_token = crypto.randomBytes(32).toString('hex');
    const current_date = new Date();
    const expiration_time = new Date(current_date.getTime() + 60 * 60 * 1000);

    const newToken = new Token({
      email: email,
      reset_token: reset_token,
      token_expiry: expiration_time
    });

    await db.collection('tokens').insertOne(newToken);

    return {
      success: true, 
      message: 'Reset token generated successfully.',
      token: reset_token
    };
  } catch (error) {
    console.error('Error generating reset token: ', error);
    return { success: false, message: 'Error generating reset token.' };
  }
};

export const validateToken = async (reset_token) => {
  const client = await clientPromise;
  const db = client.db();

  try {
    const token_db = await db.collection('tokens').findOne({ reset_token });

    if (!token_db) {
      return { success: false, message: 'Token not found or invalid.' };
    }

    const current_time = new Date();
    if (token_db.token_expiry < current_time) {
      return { success: false, message: 'Token has expired.' };
    }

    return { success: true, token: token_db }
  } catch (error) {
    console.error('Error finding token: ', error);
    return { success: false, message: 'Server error during token verification.' };
  }
};

export const removeToken = async (reset_token) => {
  const client = await clientPromise;
  const db = client.db();

  try {
    const deletedToken = await db.collection('tokens').deleteOne({ reset_token });

    if(deletedToken.deletedCount === 0) {
      return { success: false, message: 'Token not found.' };
    }

    return { success: true, message: 'Token deleted successfully' };
  } catch(error) {
    console.error('Error deleting token: ', error);
    return { success: false, message: 'Error deleting token' };
  }
}

export const getUserById = async (userId) => {
  const client = await clientPromise;
  const db  = client.db();

  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if(!user)  {
      return  {success: false, message: 'User not found.' };
    }

    return { success: true, user };
  }
  catch(error) {
    console.error('Error retrieving user: ', error);
    return { success: false, message: 'Error retrieving user.' };
  }
}

export const searchAccounts = async(searchQuery) => {
  try {
    const client = await clientPromise;
    const db = client.db();

    const accounts = await db
      .collection('users')
      .find({ username: { $regex: searchQuery, $options: 'i' } })
      .project({ username: 1 })
      .toArray();

    return { success: true, accounts};
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return { success: false, message: 'Error fetching accounts' };
  }
}

export const updateProfile = async(userId, username, name, bio, profilePicPath) => {
  try {
    const client = await clientPromise;
    const db = client.db();

    const updatedProfile = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          username: username,
          name: name,
          bio: bio,
          profilePic: profilePicPath,
        }
      }
    );

    return { success: true, updatedProfile};
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, message: 'Error updating profile' };
  }
}

export const followAccount = async (user, currentUser) => {
  try {
    const client = await clientPromise;
    const db = client.db();

    const userId = user._id;
    const currentUserId = currentUser._id;

    const updateCurrentUser = await db.collection('users').updateOne(
      {_id: new ObjectId(currentUserId) },
      { 
        $addToSet: { following: userId },
        $inc: { numFollowing: 1 },
      },
      { new: true }
    );

    if(!updateCurrentUser) {
      return { success: false, message: 'The user trying to follow does not exist' }
    }

    const updateUser = await db.collection('users').updateOne(
      {_id: new ObjectId(userId) },
      { 
          $addToSet: { followers: currentUserId, notifications: `${currentUser.username} started following you.` },
          $inc: { numFollowers: 1 },
      },
      { new: true }
    );

    if(!updateUser) {
      return { success: false, message: 'The user you\'re trying to follow does not exist' }
    }

    return { success: true, message: 'Successfully followed the user' };
  } catch (error) {
    console.error("Error in following user: ", error);
    return { success: false, message: `Error: ${error.message}` };
  }
}

export const unfollowAccount = async (user, currentUser) => {
  try {
    const client = await clientPromise;
    const db = client.db();

    const userId = user._id;
    const currentUserId = currentUser._id;

    const updateCurrentUser = await db.collection('users').updateOne(
      {_id: new ObjectId(currentUserId) },
      { 
        $pull: { following: userId },
        $inc: { numFollowing: -1 },
      },
      { new: true }
    );

    if(!updateCurrentUser) {
      return { success: false, message: 'The user trying to unfollow does not exist' }
    }

    const updateUser = await db.collection('users').updateOne(
      {_id: new ObjectId(userId) },
      { 
          $pull: { followers: currentUserId },
          $inc: { numFollowers: -1 },
      },
      { new: true }
    );

    if(!updateUser) {
      return { success: false, message: 'The user you\'re trying to unfollow does not exist' }
    }

    return { success: true, message: 'Successfully unfollowed the user' };
  } catch (error) {
    console.error("Error in unfollowing user: ", error);
    return { success: false, message: `Error: ${error.message}` };
  }
}

export const isFollowing = async(currentUser, user) => {
  try {
    const client = await clientPromise;
    const db = client.db();

    const currentUserId = currentUser._id;
    const userId = user._id;

    const currentUserData = await db.collection('users').findOne({ _id: new ObjectId(currentUserId) });

    if (!currentUserData) {
      return { following: false, message: 'Current user does not exist' };
    }

    if (currentUserData.following.includes(userId)) {
      return { following: true };
    } else {
      return { following: false };
    }
  } catch (error) {
    console.error("Error in checking following status: ", error);
    return { following: false, message: error.message };
  }
}

export const updateUserSchema = async() => {
  const client = await clientPromise;
  const db = client.db();

  try {
    const users = await db.collection('users').find({}).toArray();

    for (const user of users) {
      const updates = {};

      if(user.name === undefined) updates.name = '';
      if(user.email === undefined) updates.email = '';
      if(user.username === undefined) updates.username = '';
      if(user.password === undefined) updates.password = '';
      if(user.numFollowers === undefined) updates.numFollowers = '';
      if(user.numFollowing === undefined) updates.numFollowing = 0;
      if(!Array.isArray(user.followers)) updates.followers = [];
      if(!Array.isArray(user.following)) updates.following = [];
      if(user.bio === undefined) updates.bio = '';
      if(user.profilePic === undefined) updates.profilePic = '';
      if(!Array.isArray(user.notifications)) updates.notifications = [];

      if(Object.keys(updates).length > 0) {
        await db.collection('users').updateOne(
          { _id: user._id },
          { $set: updates }
        );
      }
    }

    console.log('All users updated with missing fields');
  } catch (error) {
    console.error('Error updating user schema: ', error);
  }
}