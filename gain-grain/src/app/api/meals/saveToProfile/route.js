import { NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb";

export async function POST(req) {
    try {
        const body = await req.json();
        const { userId, meal, date } = body;

        if (!userId || !meal || !date) {
            return NextResponse.json({ success: false, message: 'Missing required fields'});
        }

        // Debug logs
        console.log('Raw incoming meal:', meal);
        console.log('Raw ingredients:', meal.ingredients);

        // Ensure ingredients are properly formatted
        const formattedIngredients = meal.ingredients.map(ingredient => {
            console.log('Processing ingredient:', ingredient);
            
            // Handle case where ingredient might be undefined
            if (!ingredient) {
                console.warn('Undefined ingredient found');
                return null;
            }

            return {
                name: ingredient.name || 'Unknown',
                amount: ingredient.amount || 'as needed'
            };
        }).filter(Boolean); // Remove any null values

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