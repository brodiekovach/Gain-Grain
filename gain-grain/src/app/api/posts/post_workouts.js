import { clientPromise } from 'mongodb';

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db();
    const workoutsCollection = db.collection('workouts');

    if (req.method === 'POST') {
        const { exercises, userId } = req.body;

        try {
            const result = await workoutsCollection.insertOne({
                userId,   // associate the workout with a specific user
                exercises,
                date: new Date(), // timestamp for when the workout was created
            });

            res.status(201).json({ message: 'Workout added!', result });
        } catch (error) {
            res.status(500).json({ message: 'Failed to save workout', error });
        }
    }

    if (req.method === 'GET') {
        const { userId } = req.query;

        try {
            // Fetch workouts for a specific user
            const workouts = await workoutsCollection.find({ userId }).toArray();
            res.status(200).json({ workouts });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch workouts', error });
        }
    }

    client.close();
}
