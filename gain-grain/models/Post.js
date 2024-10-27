import mongoose from 'mongoose'; // Use ES Module import

// Define the Post schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Reference to User model for commenters
    },
    comment: {
      type: String,
      required: true
    },
    date: { 
      type: Date, 
      default: Date.now 
    }
  }]
});

// Create a model for the Post schema
const Post = mongoose.model('Post', postSchema);

export default Post;