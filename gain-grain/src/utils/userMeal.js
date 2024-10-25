import mongoose from 'mongoose';
import clientPromise from './mongodb';
import MealPost from './postModels/Post'

const mealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  meals: [
    {
      name: { type: String, required: true },
      ingredients: { type: [String], required: true },
      calories: { type: Number, required: true },
      link: {
        type: String,
        required: false,
        validate: {
          validator: function(v) {
            return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
          },
          message: props => '${props.value} is not a valid URL.'
        }
      }
    }
  ]
});

const Meal = mongoose.models.Meal || mongoose.model('Meal', mealSchema);

// Function to create a meal
export const createMeal = async (userId, meals) => {
  const client = await clientPromise; // Use the MongoDB client
  const db = client.db(); // Access the database
  const mealsCollection = db.collection('meals'); // Access the meals collection

  const result = await mealsCollection.insertOne({ userId, meals }); // Insert the meal
  return result; // Return the result of the insert operation
};

// Function to find meals by userId
export const findMealsByUserId = async (userId) => {
  const client = await clientPromise; // Use the MongoDB client
  const db = client.db(); // Access the database
  const mealsCollection = db.collection('meals'); // Access the meals collection

  const meals = await mealsCollection.find({ userId }).toArray(); // Find meals by userId
  return meals; // Return the list of meals
};

// Function to delete a meal by ID
export const deleteMealById = async (mealId) => {
  const client = await clientPromise; // Use the MongoDB client
  const db = client.db(); // Access the database
  const mealsCollection = db.collection('meals'); // Access the meals collection

  // if mealID is number, convert to ObjectId
  const objectId = Number.isInteger(mealId) ? mongoose.Types.ObjectId.createFromTime(mealId) : new mongoose.Types.ObjectId(mealId);

  const result = await workoutsCollection.deleteOne({ _id: objectId}); // Delete the workout by ID
  return result; // Return the result of the delete operation
};

export const saveMealPost = async(userId, meal) => {
  const client = await clientPromise;
  const db = client.db();

  try {
    await db.collection('mealPosts').insertOne({
      userId,
      meal,
      date: new Date(),
    });

    return { success: true }
  } catch (error) {
    console.error('Error posting meal:', error);
    return NextResponse.json({ success: false, message: 'Error posting meal.' });
  }
}

export default Meal;