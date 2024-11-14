import { NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb";

export async function POST(req) {
    try {
        const body = await req.json();
        const { userId, meal, date } = body;

        if (!userId || !meal || !date) {
            return NextResponse.json({ success: false, message: 'Missing required fields'});
        }

        // Validate and format ingredients
        if (!Array.isArray(meal.ingredients)) {
            console.error('Invalid ingredients format:', meal.ingredients);
            return NextResponse.json({ success: false, message: 'Invalid ingredients format'});
        }

        // Ensure each ingredient has the correct structure
        const formattedIngredients = meal.ingredients.map(ingredient => {
            if (!ingredient || typeof ingredient !== 'object') {
                console.error('Invalid ingredient:', ingredient);
                return { name: 'Unknown', amount: 'as needed' };
            }

            return {
                name: ingredient.name || 'Unknown',
                amount: ingredient.amount || 'as needed'
            };
        });

        console.log('Formatted ingredients:', formattedIngredients);

        const client = await clientPromise;
        const db = client.db();
        const result = await db.collection('meals').insertOne({
            userId,
            meal: {
                name: meal.name,
                ingredients: formattedIngredients,
                calories: meal.calories,
                link: meal.link,
            },
            date: new Date(date),
        });

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error('Error in save meals API:', error);
        return NextResponse.json({ success: false, message: 'Server error'});
    }
}