"use client";
import { useState, useEffect } from 'react';

export default function PostMeals() {
    const [meal, setMeal] = useState(
        { name: '', calories: '', protein: '', carbs: '', fats: '' },
    );
    const [userId, setUserId] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await fetch('/api/profile/get-user-from-session', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
            });
    
            const data = await response.json();
    
            if (data.success) {
              setUserId(data.user._id);
            }
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchUserData();
      }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMeal((prevMeal) => ({
            ...prevMeal,
            [name]: value,
        }));
    };

    // Placeholder function for submitting the meal data
    const handleSubmitMeal = async() => {
        try {
            const response = await fetch('/api/posts/post-meal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, meal }), 
            });

            const mealResult = await response.json();

            if(!mealResult.success) {
                setError('Failed to post meal.');
                return;
            }

            const savedPost = await fetch('/api/posts/save-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId,
                    postType: 'Meal',
                    postData: {
                        meal,
                        date: new Date(),
                    }
                }),
            });

            const postResult = await savedPost.json();

            if(!postResult.success) {
                setError('Failed to post meal.');
                return;
            } else {
                console.log('Meal posted.');
                setSuccess('Meal posted!');
                await new Promise(r => setTimeout(r, 2000));
                window.location.href = '/post';
            }
        } catch (error) {
            console.error('Error posting meal:', error);
            setError('Error posting meal. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl">
                <h1 className="text-3xl font-bold mb-6 text-center">Post Meals / Recipes</h1>
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Meal / Recipe</th>
                            <th className="border px-4 py-2">Calories</th>
                            <th className="border px-4 py-2">Protein (g)</th>
                            <th className="border px-4 py-2">Carbohydrates (g)</th>
                            <th className="border px-4 py-2">Fats (g)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <td className="border px-4 py-2">
                            <input
                                type="text"
                                name="name"
                                value={meal.name}
                                onChange={handleChange}
                                className="border w-full px-2 py-1 rounded"
                                placeholder="Meal name"
                            />
                        </td>
                        <td className="border px-4 py-2">
                            <input
                                type="number"
                                name="calories"
                                value={meal.calories}
                                onChange={handleChange}
                                className="border w-full px-2 py-1 rounded"
                                placeholder="Calories"
                            />
                        </td>
                        <td className="border px-4 py-2">
                            <input
                                type="number"
                                name="protein"
                                value={meal.protein}
                                onChange={handleChange}
                                className="border w-full px-2 py-1 rounded"
                                placeholder="Protein"
                            />
                        </td>
                        <td className="border px-4 py-2">
                            <input
                                type="number"
                                name="carbs"
                                value={meal.carbs}
                                onChange={handleChange}
                                className="border w-full px-2 py-1 rounded"
                                placeholder="Carbs"
                            />
                        </td>
                        <td className="border px-4 py-2">
                            <input
                                type="number"
                                name="fats"
                                value={meal.fats}
                                onChange={handleChange}
                                className="border w-full px-2 py-1 rounded"
                                placeholder="Fats"
                            />
                        </td>
                    </tbody>
                </table>
                <button
                    onClick={handleSubmitMeal}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    Submit Meal
                </button>
            </div>
            {success && <p className="text-green-500 mt-4">{success}</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}
