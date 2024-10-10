import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import clientPromise from './mongodb'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  username: { type: String, required: true },
  password: { type: String, required: true }
});

const tokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  reset_token: { type: String, rerquired: true },
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
      password: hashedPassword
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

export const findUserWithEmail = async (email) => {
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

  try  {
    const user = await  db.collection('users').findOne({ userId });

    if(!user)  {
      return {success :  false, message : 'User not found.' };
    }

    return {success : true, username};
  }
  catch(error) {
    console.error('Error retrieving user: ', error);
    return { success: false, message: 'Error retrieving user.' };
  }
}