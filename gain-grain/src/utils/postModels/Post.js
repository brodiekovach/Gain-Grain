import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const postSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        postType: { type: String, required: true },
        likeCount: [{ type: String }],
        comments: [commentSchema],
    },
    { discriminatorKey: 'postType', collection: 'posts' }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

const blogSchema = new mongoose.Schema({
    content: { type: String, required: true },
    date: { type: Date, required: true },
});

const mealSchema = new mongoose.Schema({
    meal: [
        {
            name: { type: String, required: true },
            calories: { type: Number, required: true },
            protein: { type: Number, required: true },
            carbs: { type: Number, required: true },
            fats: { type: Number, required: true },
        },
    ],
    date: { type: Date, required: true }
});

const progressPicSchema = new mongoose.Schema({
    progressPic: { type: String, required: true },
    date: { type: Date, required: true },
});


const workoutSchema = new mongoose.Schema({
    title: { type: String, required: true },
    exercises: [
        {
            name: { type: String, required: true },
            sets: { type: Number },
            reps: { type: Number },
        },
    ],
    date: { type: Date, required: true }
});

const Blog = mongoose.models.Blog || Post.discriminator('Blog', blogSchema);
const MealPost = mongoose.models.Meal || Post.discriminator('Meal', mealSchema);
const ProgressPic = mongoose.models.ProgressPic || Post.discriminator('ProgressPic', progressPicSchema);
const Workout = mongoose.models.Workout || Post.discriminator('Workout', workoutSchema);

export { Post, Blog, MealPost, ProgressPic, Workout };