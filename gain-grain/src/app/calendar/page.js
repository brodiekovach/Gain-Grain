// CustomCalendar.js
'use client';

import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FaAngleLeft, FaAngleRight, FaPlus, FaList } from 'react-icons/fa';
import './custom_calendar.css'; 
import './style.css';
import ExerciseSearch from './exerciseSearch';
import Modal from './modal';
import TitleModal from './titleModal';
import Navbar from "../../components/Navbar";

// Helper function to get all Sundays of a month
const getSundaysOfMonth = (date) => {
    const sundays = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get first day of the month
    const firstDay = new Date(year, month, 1);
    
    // Get first Sunday
    let currentDay = new Date(firstDay);
    currentDay.setDate(1);
    while (currentDay.getDay() !== 0) {
        currentDay.setDate(currentDay.getDate() + 1);
    }
    
    // Get all Sundays
    while (currentDay.getMonth() === month) {
        sundays.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 7);
    }
    
    return sundays;
};

const CustomCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [eventsArr, setEventsArr] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [showTitleForSaving, setShowTitleForSaving] = useState(false);
    const [activeDay, setActiveDay] = useState(null);
    const [days, setDays] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [selectedMeals, setSelectedMeals] = useState([]);
    const [showExerciseSearch, setShowExerciseSearch] = useState(false);
    const [mealName, setMealName] = useState('');
    const [mealCalories, setMealCalories] = useState('');
    const [mealIngredients, setMealIngredients] = useState([]); // New state for ingredients
    const [addingType, setAddingType] = useState('');
    const [activeButton, setActiveButton] = useState('');
    const [showExerciseDropdown, setShowExerciseDropdown] = useState(false);
    const [exerciseOption, setExerciseOption] = useState('');
    const [showMealDropdown, setShowMealDropdown] = useState(false);
    const [mealOption, setMealOption] = useState('');
    const [mealUrl, setMealUrl] = useState(''); // State to hold the meal URL
    const [workoutTitle, setWorkoutTitle] = useState('');
    const [savedWorkouts, setSavedWorkouts] = useState([]);
    const [loadingWorkouts, setLoadingWorkouts] = useState(false);
    const [savedMeals, setSavedMeals] = useState([]);
    const [loadingMeals, setLoadingMeals] = useState(false);
    const [tempweight, setTempWeight] = useState({});
    const [ingredientsExpanded, setIngredientsExpanded] = useState(false);
    const [urlParseError, setUrlParseError] = useState('');
    const [selectedSunday, setSelectedSunday] = useState(null);
    const [groceryList, setGroceryList] = useState({});
    const [showGroceryModal, setShowGroceryModal] = useState(false);
    const [workoutStatus, setWorkoutStatus] = useState(() => {
        // Check if window is defined (client-side) before accessing localStorage
        if (typeof window !== 'undefined') {
            const savedStatus = localStorage.getItem('workoutStatus');
            return savedStatus ? JSON.parse(savedStatus) : {};
        }
        return {}; // Return empty object as default for server-side rendering
    });
    const [workoutTimer, setWorkoutTimer] = useState(0); // Timer for the workout
    const [isWorkoutActive, setIsWorkoutActive] = useState(false); // Track if workout is active
    const [workoutModalVisible, setWorkoutModalVisible] = useState(false); // Control workout modal visibility
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0); // Track current exercise in modal

    const sundays = getSundaysOfMonth(currentMonth);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        // Initialize calendar and load data for current date
        const today = new Date();
        initCalendar();
        setSelectedDate(today); // Ensure today's date is set
        loadExercisesForDate(today);
        loadMealsForDate(today);
    }, [currentMonth]); // Only depend on currentMonth changes

    useEffect(() => {
        if (selectedDate) {
            loadExercisesForDate(selectedDate);
            loadMealsForDate(selectedDate);
        }
    }, [selectedDate]);

    useEffect(() => {
        if (selectedDate) {
            saveExercisesToLocalStorage(selectedExercises);
        }
    }, [selectedExercises, selectedDate]);

    useEffect(() => {
        if (selectedDate) {
            saveMealsToLocalStorage(selectedMeals);
        }
    }, [selectedMeals, selectedDate]);

    const initCalendar = () => {
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const prevLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
        const prevDays = prevLastDay.getDate();
        const lastDate = lastDay.getDate();
        const dayOfWeek = firstDay.getDay();
        const nextDays = 7 - lastDay.getDay() - 1;

        let calendarDays = [];

        for (let x = dayOfWeek; x > 0; x--) {
            calendarDays.push({ day: prevDays - x + 1, isPrevMonth: true });
        }

        for (let i = 1; i <= lastDate; i++) {
            const hasEvent = eventsArr.some(event =>
                event.day === i &&
                event.month === currentMonth.getMonth() + 1 &&
                event.year === currentMonth.getFullYear());
            calendarDays.push({ day: i, isActive: i === activeDay, hasEvent });
        }

        for (let j = 1; j <= nextDays; j++) {
            calendarDays.push({ day: j, isNextMonth: true });
        }

        setDays(calendarDays);
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
    };

    const loadExercisesForDate = (date) => {
        const dateKey = date.toISOString().split('T')[0];
        const savedExercises = localStorage.getItem(`exercises_${dateKey}`);
        if (savedExercises) {
            setSelectedExercises(JSON.parse(savedExercises));
        } else {
            setSelectedExercises([]); // Reset if no data found
        }
    };

    const loadMealsForDate = (date) => {
        const dateKey = date.toISOString().split('T')[0];
        const savedMeals = localStorage.getItem(`meals_${dateKey}`);
        if (savedMeals) {
            setSelectedMeals(JSON.parse(savedMeals));
        } else {
            setSelectedMeals([]); // Reset if no data found
        }
    };

    const handleDayClick = (day, isPrevMonth, isNextMonth) => {
        if (isPrevMonth) {
            handlePrevMonth();
        } else if (isNextMonth) {
            handleNextMonth();
        } else {
            setActiveDay(day);
            setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
        }
    };

    const handleRemoveExercise = (exerciseIndex) => {
        const updatedExercises = selectedExercises.filter((_, index) => index !== exerciseIndex);
        setSelectedExercises(updatedExercises);
        saveExercisesToLocalStorage(updatedExercises);
    };
    
    const handleRemoveMeal = (mealIndex) => {
        const updatedMeals = selectedMeals.filter((_, index) => index !== mealIndex);
        setSelectedMeals(updatedMeals);
        saveMealsToLocalStorage(updatedMeals);
    };

    const saveExercisesToLocalStorage = (exercises) => {
        const dateKey = selectedDate.toISOString().split('T')[0];
        localStorage.setItem(`exercises_${dateKey}`, JSON.stringify(exercises));
    };

    const saveMealsToLocalStorage = (meals) => {
        const dateKey = selectedDate.toISOString().split('T')[0];
        localStorage.setItem(`meals_${dateKey}`, JSON.stringify(meals));
    };
    

    const handleAddMeal = () => {
        if (mealName && mealCalories) {
            // Convert mealIngredients string to array format if it's not already an array
            let ingredients = mealIngredients;
            if (typeof mealIngredients === 'string' && mealIngredients) {
                ingredients = [{
                    name: mealIngredients,
                    amount: {
                        quantity: 1,
                        unit: 'unit'
                    }
                }];
            }

            const newMeal = {
                name: mealName,
                calories: mealCalories,
                ingredients: ingredients,
                link: mealUrl,
            };

            const updatedMeals = [...selectedMeals, newMeal];
            setSelectedMeals(updatedMeals);
            saveMealsToLocalStorage(updatedMeals);
            
            // Reset form
            setMealName('');
            setMealCalories('');
            setMealIngredients([]);
            setMealUrl('');
            setMealOption('');
            setAddingType('');
            setShowModal(false);
        }
    };

    const handleSelectExercise = (exercise) => {

        const newExercise = {
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight || null,
        }

        setSelectedExercises(prev => [...prev, newExercise]); // Add selected exercise
        saveExercisesToLocalStorage([...selectedExercises, newExercise]); // Save to localStorage
        setShowExerciseSearch(false); // Close search after selection
        setShowModal(false); // Close modal
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleSaveWorkout = (title) => {
        saveWorkoutToProfile(title);
        setWorkoutTitle('');
        setShowTitleForSaving(false);
    }

    const handleImportUrl = async () => {
        if (!mealUrl) return;
        setUrlParseError('');
    
        try {
            const response = await fetch('/api/meals/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: mealUrl }),
            });
    
            const data = await response.json();
            
            if (!response.ok) {
                setUrlParseError(data.message);
                toast.error(data.message || 'Failed to import recipe');
                return;
            }
    
            if (data.success) {
                // Format ingredients to match the expected structure
                const formattedIngredients = data.ingredients.map(ingredient => ({
                    name: ingredient.name,
                    amount: ingredient.amount // Keep the amount as a string
                }));

                setMealName(data.name);
                setMealIngredients(formattedIngredients);
                setMealCalories(data.calories);
    
                if (!data.caloriesFound) {
                    toast.warning('Recipe imported successfully, but calories information could not be found.');
                } else {
                    toast.success('Recipe imported successfully!');
                }
            }
        } catch (error) {
            setUrlParseError('This website is not yet supported for parsing')
            console.error('Error fetching the recipe:', error);
            toast.error('Failed to import recipe. Please try again.');
        }
    };

    const saveWorkoutToProfile = async (title) => {
        let userId = "";
            try {
                const response = await fetch('/api/profile/get-user-from-session', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        
                const data = await response.json();
        
                if (data.success) {
                    userId = data.user._id;
                }
            } catch (error) {
                console.error(error);
            }

        try {
            const response = await fetch('/api/workouts/saveToProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userId,
                    exercises: selectedExercises,
                    date: selectedDate,
                    title,
                }),
            });

            const data = await response.json();
            if (data.success) {
                alert('Workout saved successfully!');
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error saving workout:', error);
            alert('Failed to save workout');
        }
    };
    
    const saveMealToProfile = async (meal) => {
        let userId = "";
        try {
            const response = await fetch('/api/profile/get-user-from-session', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                userId = data.user._id;
            }
        } catch (error) {
            console.error(error);
        }

        try {
            // Log the incoming meal data for debugging
            console.log('Meal before saving:', meal);

            // Format ingredients to ensure they're strings
            const formattedIngredients = meal.ingredients.map(ingredient => ({
                name: ingredient.name,
                amount: typeof ingredient.amount === 'string' 
                    ? ingredient.amount 
                    : ingredient.amount.quantity && ingredient.amount.unit
                        ? `${ingredient.amount.quantity} ${ingredient.amount.unit}`
                        : 'as needed'
            }));

            const MealData = {
                name: meal.name,
                ingredients: formattedIngredients,
                calories: meal.calories,
                link: meal.link,
            };

            console.log('Formatted meal data:', MealData);

            const response = await fetch('/api/meals/saveToProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userId, 
                    meal: MealData, 
                    date: selectedDate
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Meal saved successfully!');
            } else {
                toast.error(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error saving meal:', error);
            toast.error('Failed to save meal');
        }
    };

    // Function to fetch workouts by userId
    const fetchUserWorkouts = async () => {
        let userId = "";
            try {
                const response = await fetch('/api/profile/get-user-from-session', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        
                const data = await response.json();
        
                if (data.success) {
                    userId = data.user._id;
                }
            } catch (error) {
                console.error(error);
            }
    
        try {
            const response = await fetch('/api/workouts/getSavedWorkouts', {
                method: 'POST', // Change to POST
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }), // Send userId in the body
            });
    
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setSavedWorkouts(data.workouts); // Set savedWorkouts to the workouts array
                    console.log("Fetched Workouts:", data.workouts); // Log fetched workouts
                } else {
                    console.error('Failed to fetch workouts:', data.message);
                    setSavedWorkouts([]); // Set to empty array if not successful
                }
            } else {
                console.error('Failed to fetch workouts:', response.statusText);
                setSavedWorkouts([]); // Handle response error
            }
        } catch (error) {
            console.error('Error fetching workouts:', error);
            setSavedWorkouts([]); // Handle fetch error
        }
    };

    const fetchUserMeals = async () => {
        let userId = "";
            try {
                const response = await fetch('/api/profile/get-user-from-session', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        
                const data = await response.json();
        
                if (data.success) {
                    userId = data.user._id;
                }
            } catch (error) {
                console.error(error);
            }
    
        try {
            const response = await fetch('/api/meals/getSavedMeals', {
                method: 'POST', // Change to POST
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }), // Send userId in the body
            });
    
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setSavedMeals(data.meals); // Set savedWorkouts to the workouts array
                } else {
                    console.error('Failed to fetch meals:', data.message);
                    setSavedMeals([]); // Set to empty array if not successful
                }
            } else {
                console.error('Failed to fetch meals:', response.statusText);
                setSavedMeals([]); // Handle response error
            }
        } catch (error) {
            console.error('Error fetching meals:', error);
            setSavedMeals([]); // Handle fetch error
        }
    }
    

    const handleSelectWorkout = (workout) => {
        // Assuming workout.exercises is an array of exercise objects
        const exercisesToAdd = workout.exercises.map((exercise) => ({
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
        }));
    
        setSelectedExercises((prevExercises) => [...prevExercises, ...exercisesToAdd]);
        setExerciseOption('');
        toggleModal(); // Close the modal after adding
    };
    
    const handleSelectMeal = (savedMeal) => {
        const newMeal = {
            name: savedMeal.meal.name,
            calories: savedMeal.meal.calories,
            ingredients: savedMeal.meal.ingredients, // Make sure to include ingredients
            link: savedMeal.meal.link
        };

        const updatedMeals = [...selectedMeals, newMeal];
        setSelectedMeals(updatedMeals);
        saveMealsToLocalStorage(updatedMeals);
        setShowModal(false);
    };

    // Helper function to get all meals for a week
    const getMealsForWeek = (sundayDate) => {
        if (!sundayDate) return [];
        
        const meals = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(sundayDate);
            currentDate.setDate(sundayDate.getDate() + i);
            const dateKey = currentDate.toISOString().split('T')[0];
            const savedMeals = localStorage.getItem(`meals_${dateKey}`);
            if (savedMeals) {
                try {
                    const parsedMeals = JSON.parse(savedMeals);
                    if (Array.isArray(parsedMeals)) {
                        meals.push(...parsedMeals);
                    }
                } catch (error) {
                    console.error('Error parsing meals:', error);
                }
            }
        }
        return meals;
    };

    // Modified handleSundayChange function
    const handleSundayChange = (event) => {
        if (!event.target.value) {
            setSelectedSunday(null);
            setGroceryList({});
            return;
        }

        const selectedSundayDate = new Date(event.target.value);
        setSelectedSunday(selectedSundayDate);

        const weeklyMeals = getMealsForWeek(selectedSundayDate);
        
        if (!weeklyMeals.length) {
            setGroceryList({});
            return;
        }

        // Standardized ingredient combination logic
        const combinedGroceryList = {};
        
        weeklyMeals.forEach(meal => {
            if (meal?.ingredients && Array.isArray(meal.ingredients)) {
                meal.ingredients.forEach(ingredient => {
                    if (!ingredient?.name) return;
                    
                    const name = ingredient.name.trim();
                    
                    // Handle both string amounts and object amounts
                    let amountStr = '';
                    if (typeof ingredient.amount === 'string') {
                        amountStr = ingredient.amount;
                    } else if (typeof ingredient.amount === 'object') {
                        amountStr = `${ingredient.amount.quantity} ${ingredient.amount.unit}`;
                    }
                    
                    // Handle "as needed" case
                    if (amountStr === 'as needed') {
                        if (!combinedGroceryList[name]) {
                            combinedGroceryList[name] = {
                                amounts: ['as needed']
                            };
                        }
                        return;
                    }

                    // Parse amount string (e.g., "2 pounds" -> { value: 2, unit: "pounds" })
                    const amountMatch = amountStr ? amountStr.match(/^(\d+(?:\.\d+)?)\s*(.*)$/): null;
                    
                    if (!combinedGroceryList[name]) {
                        combinedGroceryList[name] = {
                            amounts: []
                        };
                    }

                    if (amountMatch) {
                        const value = parseFloat(amountMatch[1]);
                        const unit = amountMatch[2].trim();
                        
                        // Find existing amount with same unit
                        const existingAmount = combinedGroceryList[name].amounts.find(
                            a => a.unit === unit
                        );

                        if (existingAmount) {
                            existingAmount.value += value;
                        } else {
                            combinedGroceryList[name].amounts.push({
                                value,
                                unit
                            });
                        }
                    } else if (amountStr) {
                        // If amount format doesn't match, store as is
                        combinedGroceryList[name].amounts.push({
                            raw: amountStr
                        });
                    }
                });
            }
        });

        setGroceryList(combinedGroceryList);
    };

    // Effect to update grocery list when meals change
    useEffect(() => {
        if (selectedSunday) {
            handleSundayChange({ 
                target: { 
                    value: selectedSunday.toISOString() 
                } 
            });
        }
    }, [selectedMeals]); // Update when meals change

    const handleStartWorkout = (day) => {
        if (selectedExercises.length > 0 && selectedExercises.every(exercise => exercise.Weight)) {
            setActiveDay(day);
            setWorkoutTimer(0); // Reset timer
            setIsWorkoutActive(true);
            setWorkoutModalVisible(true);
            setCurrentExerciseIndex(0); // Start from the first exercise
        } else {
            alert("Please add exercises and weights to start the workout.");
        }
    };

    const handleNextExercise = () => {
        if (currentExerciseIndex < selectedExercises.length - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
        }
    };

    const handlePreviousExercise = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(currentExerciseIndex - 1);
        }
    };

    const handleEndWorkout = () => {
        setIsWorkoutActive(false);
        setWorkoutModalVisible(false);
        const formattedTime = new Date(workoutTimer * 1000).toISOString().substr(11, 8); // Format time as HH:MM:SS
        const updatedStatus = {
            ...workoutStatus,
            [activeDay]: { completed: true, time: formattedTime },
        };
        setWorkoutStatus(updatedStatus);
        localStorage.setItem('workoutStatus', JSON.stringify(updatedStatus));
    };

    const handleResetWorkout = (day) => {
        const updatedStatus = { ...workoutStatus };
        delete updatedStatus[day]; // Remove the workout status for the specific day
        setWorkoutStatus(updatedStatus);
        localStorage.setItem('workoutStatus', JSON.stringify(updatedStatus));
    };

    useEffect(() => {
        let timer;
        if (isWorkoutActive) {
            timer = setInterval(() => {
                setWorkoutTimer((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isWorkoutActive]);

    const renderDays = () => {
        return days.map((dayObj, index) => (
            <div
                key={index}
                className={`day ${dayObj.isPrevMonth ? 'prev-date' : ''} ${dayObj.isNextMonth ? 'next-date' : ''} ${dayObj.isActive ? 'active' : ''} ${dayObj.hasEvent ? 'event' : ''}`}
                onClick={() => handleDayClick(dayObj.day, dayObj.isPrevMonth, dayObj.isNextMonth)}
            >
                {dayObj.day}
            </div>
        ));
    };

    // Debugging: Log the selectedExercises and currentExerciseIndex
    useEffect(() => {
        console.log('Selected Exercises:', selectedExercises);
        console.log('Current Exercise Index:', currentExerciseIndex);
    }, [selectedExercises, currentExerciseIndex]);

    return (
        <main className="calendar-main">
            <Navbar/>
            <div className="container">
                
                <div className="left">
                    <div className="calendar">
                        <div className="month">
                            <FaAngleLeft className="prev" onClick={handlePrevMonth} />
                            <div className="date">
                                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </div>
                            <FaAngleRight className="next" onClick={handleNextMonth} />
                        </div>
                        <div className="weekdays">
                            <div>Sun</div>
                            <div>Mon</div>
                            <div>Tue</div>
                            <div>Wed</div>
                            <div>Thu</div>
                            <div>Fri</div>
                            <div>Sat</div>
                        </div>
                        <div className="days">
                            {renderDays()}
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="today-date">
                        <div className="event-day">{selectedDate.toLocaleDateString('default', { weekday: 'long' })}</div>
                        <div className="event-date">{selectedDate.toDateString()}</div>
                    </div>
                    
                    {activeDay && (
                        <div className="workout-status">
                            <span>
                                {workoutStatus[activeDay]?.completed ? 
                                    `Workout Completed: ${workoutStatus[activeDay].time}` : 
                                    "Workout Not Completed"}
                            </span>
                            {!workoutStatus[activeDay]?.completed && (
                                <button 
                                    className="start-workout-btn" 
                                    onClick={() => handleStartWorkout(activeDay)}
                                    disabled={selectedExercises.length === 0 || !selectedExercises.every(exercise => exercise.Weight)}
                                    title={selectedExercises.length === 0 ? "Add exercises to start workout" : "Add weights to all exercises to start workout"}
                                >
                                    Start Workout
                                </button>
                            )}
                            {workoutStatus[activeDay]?.completed && (
                                <button 
                                    className="reset-workout-btn" 
                                    onClick={() => handleResetWorkout(activeDay)}
                                >
                                    Reset Workout
                                </button>
                            )}
                        </div>
                    )}

                    <div className="exercise-section">
                        <h3>Exercises</h3>
                        <button className='save-btn' onClick={() => setShowTitleForSaving(true)}>Save Workout to Profile</button>
                        <TitleModal
                            show={showTitleForSaving}
                            onClose={() => setShowTitleForSaving(false)}
                            onSave={handleSaveWorkout} // Pass the save function
                            title={workoutTitle}
                            setTitle={setWorkoutTitle} // Pass the state setter
                        />
                    <ul className="exercise-list">
                        {selectedExercises.map((exercise, index) => (
                            <li key={index}>
                                <div>
                                    <span className='exercise-name'>{exercise.name}</span>
                                    <div className="exercise-details">
                                        {exercise.sets} sets x {exercise.reps} reps
                                    </div>

                                    {/* Display weight if set; otherwise show input */}
                                    {exercise.Weight ? (
                                        <span>{exercise.Weight} lbs</span> // Show weight if already set
                                    ) : (
                                        <input
                                            className='weight-input'
                                            type="number"
                                            placeholder="Weight (lbs)"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const weightValue = parseFloat(e.target.value); // Get weight value from input
                                                    if (!isNaN(weightValue)) {
                                                        const updatedExercises = [...selectedExercises];
                                                        updatedExercises[index].Weight = weightValue; // Set weight
                                                        setSelectedExercises(updatedExercises);
                                                        saveExercisesToLocalStorage(updatedExercises); // Update localStorage
                                                    }
                                                    e.target.value = ''; // Clear input after setting
                                                }
                                            }}
                                            onBlur={(e) => {
                                                // Optionally handle blur, if you want to clear the input
                                                e.target.value = ''; // Clear input on blur
                                            }}
                                        />
                                    )}
                                </div>
                                <button className="remove-btn" onClick={() => handleRemoveExercise(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    </div>

                    <div className="meal-section">
                        <h3>Meals</h3>
                        <ul className="meal-list">
                            {selectedMeals.map((meal, index) => (
                                <li key={index}>
                                    <span>{meal.name} ({meal.calories} cal)</span>
                                    <div className='meal-btn-container'>
                                        <button className="remove-btn" onClick={() => handleRemoveMeal(index)}>Remove</button>
                                        <button className='remove-btn' onClick={() => saveMealToProfile(meal)}>Save Meal to Profile</button>
                                    </div>    
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="add-section">
                        <button className="grocery-button" onClick={() => setShowGroceryModal(true)}>
                            Generate Grocery List
                        </button>
                        <button className="add-button" onClick={toggleModal}>
                            <FaPlus />
                        </button>
                    </div>

                <Modal show={showModal} onClose={toggleModal}>
                    <div className="modal-body">
                        <div className="add-options">
                            <div className="dropdown">
                                <button
                                    onClick={() => setShowExerciseDropdown(!showExerciseDropdown)}
                                    className={activeButton === 'exercise' ? 'active' : ''}
                                >
                                    Add Exercise
                                </button>
                                {showExerciseDropdown && (
                                    <div className="dropdown-options">
                                        <button
                                            onClick={() => {
                                                setExerciseOption('create-new');
                                                setMealOption('');
                                                setAddingType('exercise');
                                                setShowExerciseSearch(true);
                                                setActiveButton('exercise');
                                                setShowExerciseDropdown(false);
                                            }}
                                        >
                                            Create New
                                        </button>
                                        <button
                                            onClick={() => {
                                                setExerciseOption('import-saved');
                                                setMealOption('');
                                                setAddingType('exercise');
                                                setShowExerciseSearch(false);
                                                fetchUserWorkouts();
                                                setActiveButton('exercise');
                                                setShowExerciseDropdown(false);
                                            }}
                                        >
                                            Import from Saved
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="dropdown">
                                <button
                                    onClick={() => setShowMealDropdown(!showMealDropdown)}
                                    className={activeButton === 'meal' ? 'active' : ''}
                                >
                                    Add Meal
                                </button>
                                {showMealDropdown && (
                                    <div className="dropdown-options">
                                        <button
                                            onClick={() => {
                                                setMealOption('create-new');
                                                setExerciseOption('');
                                                setAddingType('meal');
                                                setActiveButton('meal');
                                                setShowMealDropdown(false);
                                            }}
                                        >
                                            Create New
                                        </button>
                                        <button
                                            onClick={() => {
                                                setMealOption('import-saved');
                                                setActiveButton('meal');
                                                setAddingType('meal');
                                                fetchUserMeals();
                                                setExerciseOption('');
                                                setShowMealDropdown(false);
                                            }}
                                        >
                                            Import from Saved
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleImportUrl();
                                                setMealOption('import-url');
                                                setExerciseOption('');
                                                setShowMealDropdown(false);
                                            }}
                                        >
                                            Import from URL
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="add-forms">
                            {exerciseOption === 'create-new' && addingType === 'exercise' && showExerciseSearch && (
                                <ExerciseSearch onSelectExercise={handleSelectExercise} />
                            )}

                            {addingType === 'exercise' && exerciseOption === 'import-saved' && (
                                <div className="import-workout-list">
                                    {loadingWorkouts ? (
                                        <p>Loading workouts...</p>
                                    ) : !Array.isArray(savedWorkouts) || savedWorkouts.length === 0 ? (
                                        <p>No saved workouts available.</p>
                                    ) : (
                                        savedWorkouts.map((workout) => (
                                            <div key={workout._id} className="import-workout-item">
                                                <span className='import-workout-name'>{workout.title}</span>
                                                <button onClick={() => handleSelectWorkout(workout)}>Add to Day</button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}


                            {addingType === 'meal' && mealOption === 'create-new' && (
                                <div className="meal-form">
                                    <input
                                        type="text"
                                        value={mealName}
                                        onChange={(e) => setMealName(e.target.value)}
                                        placeholder="Meal Name"
                                    />
                                    <input
                                        className="meal-number"
                                        type="number"
                                        value={mealCalories}
                                        onChange={(e) => setMealCalories(e.target.value)}
                                        placeholder="Calories"
                                    />
                                    <div className="ingredients-list">
                                        {mealIngredients.map((ingredient, index) => (
                                            <div key={index} className="ingredient-item">
                                                <input
                                                    type="text"
                                                    value={ingredient.name}
                                                    onChange={(e) => {
                                                        const newIngredients = [...mealIngredients];
                                                        newIngredients[index].name = e.target.value;
                                                        setMealIngredients(newIngredients);
                                                    }}
                                                    placeholder="Ingredient name"
                                                />
                                                <input
                                                    type="number"
                                                    value={ingredient.amount.quantity}
                                                    onChange={(e) => {
                                                        const newIngredients = [...mealIngredients];
                                                        newIngredients[index].amount.quantity = parseFloat(e.target.value);
                                                        setMealIngredients(newIngredients);
                                                    }}
                                                    placeholder="Amount"
                                                />
                                                <input
                                                    type="text"
                                                    value={ingredient.amount.unit}
                                                    onChange={(e) => {
                                                        const newIngredients = [...mealIngredients];
                                                        newIngredients[index].amount.unit = e.target.value;
                                                        setMealIngredients(newIngredients);
                                                    }}
                                                    placeholder="Unit"
                                                />
                                                <button onClick={() => {
                                                    const newIngredients = mealIngredients.filter((_, i) => i !== index);
                                                    setMealIngredients(newIngredients);
                                                }}>Remove</button>
                                            </div>
                                        ))}
                                        <button onClick={() => {
                                            setMealIngredients([...mealIngredients, {
                                                name: '',
                                                amount: {
                                                    quantity: 0,
                                                    unit: ''
                                                }
                                            }]);
                                        }}>Add Ingredient</button>
                                    </div>
                                    <button onClick={handleAddMeal}>Add Meal</button>
                                </div>
                            )}

                            {addingType === 'meal' && mealOption === 'import-saved' && (
                                <div className="import-meal-list">
                                    {loadingMeals ? (
                                        <p>Loading meals...</p>
                                    ) : !Array.isArray(savedMeals) || savedMeals.length === 0 ? (
                                        <p>No saved meals available.</p>
                                    ) : (
                                        savedMeals.map((meal) => (
                                            <div key={meal._id} className="import-meal-item">
                                                <span>{meal.meal.name} ({meal.meal.calories})</span>
                                                <button onClick={() => handleSelectMeal(meal)}>Add to Day</button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                            

                            {mealOption === 'import-url' && (
                                <div className="meal-form">
                                    <h3>Import Meal from URL</h3>
                                    <input
                                        type="text"
                                        value={mealUrl} // New state variable to hold the URL
                                        onChange={(e) => setMealUrl(e.target.value)} // Update state on input change
                                        placeholder="Enter Recipe URL"
                                    />
                                    <button onClick={handleImportUrl}>Fetch Meal Details</button> {/* Button to fetch meal details */}
                                    
                                    {/* Display error message if it exists */}
                                    {urlParseError && <p className="error-message" style={{ color: 'red' }}>{urlParseError}</p>}

                                    {/* Display fetched meal details after the URL is processed */}
                                    {mealName && (
                                        <>
                                            <h3>Imported Meal Details</h3>
                                            <input
                                                type="text"
                                                value={mealName}
                                                onChange={(e) => setMealName(e.target.value)}
                                                placeholder="Meal Name"
                                            />
                                            <input
                                                className="meal-number"
                                                type="number"
                                                value={mealCalories}
                                                onChange={(e) => setMealCalories(e.target.value)}
                                                placeholder="Calories"
                                            />

                                            {/* Ingredients section with expandable list */}
                                            {mealIngredients && mealIngredients.length > 0 && (
                                                <div className="expandable-ingredients">
                                                    <p className="toggle-ingredients" onClick={() => setIngredientsExpanded(!ingredientsExpanded)}>
                                                        Ingredients {ingredientsExpanded ? '▲' : '▼'}
                                                    </p>
                                                    {ingredientsExpanded && (
                                                        <ul className="ingredients-list">
                                                            {mealIngredients.map((ingredient, index) => (
                                                                <li key={index}>
                                                                    {ingredient.amount} - {ingredient.name}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            )}

                                            <button onClick={handleAddMeal}>Add Meal</button>
                                        </>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </Modal>

                <Modal show={showGroceryModal} onClose={() => setShowGroceryModal(false)}>
                    <div className="modal-content">
                        <div className="week-selector">
                            <select 
                                value={selectedSunday ? selectedSunday.toISOString() : ''} 
                                onChange={handleSundayChange}
                            >
                                <option value="">Select Week</option>
                                {sundays.map((sunday) => (
                                    <option key={sunday.toISOString()} value={sunday.toISOString()}>
                                        Week of {sunday.toLocaleDateString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="grocery-list-container">
                            {Object.keys(groceryList).length > 0 ? (
                                <div className="grocery-list">
                                    <h3>Ingredients for Week of {selectedSunday?.toLocaleDateString()}</h3>
                                    <ul className="ingredients-list">
                                        {Object.entries(groceryList).map(([ingredient, details]) => (
                                            <li key={ingredient} className="ingredient-item">
                                                <span className="ingredient-name">{ingredient}</span>
                                                <span className="ingredient-amount">
                                                    {details.amounts.map((amount, index) => (
                                                        <span key={index}>
                                                            {index > 0 && ' + '}
                                                            {amount === 'as needed' ? 'as needed' :
                                                             amount.raw ? amount.raw :
                                                             `${amount.value} ${amount.unit}`}
                                                        </span>
                                                    ))}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="no-ingredients">No ingredients found for this week.</p>
                            )}
                        </div>
                    </div>
                </Modal>

                <Modal show={workoutModalVisible} onClose={handleEndWorkout}>
                    <div className="workout-modal">
                        <h3>Workout for {selectedDate.toDateString()}</h3>
                        <div className="timer-display">Timer: {new Date(workoutTimer * 1000).toISOString().substr(11, 8)}</div>
                        <div className="exercise-display">
                            {selectedExercises[currentExerciseIndex] ? (
                                <>
                                    <span>{selectedExercises[currentExerciseIndex].name}</span>
                                    <div>{selectedExercises[currentExerciseIndex].sets} sets x {selectedExercises[currentExerciseIndex].reps} reps</div>
                                    <span>{selectedExercises[currentExerciseIndex].Weight} lbs</span>
                                </>
                            ) : (
                                <span>No exercise selected</span>
                            )}
                        </div>
                        <div className="exercise-progress">
                            {selectedExercises.map((_, index) => (
                                <span
                                    key={index}
                                    className={`progress-circle ${index === currentExerciseIndex ? 'active' : ''}`}
                                ></span>
                            ))}
                        </div>
                        <div className="exercise-navigation">
                            <button onClick={handlePreviousExercise} disabled={currentExerciseIndex === 0}>Previous</button>
                            <button onClick={handleNextExercise} disabled={currentExerciseIndex === selectedExercises.length - 1}>Next</button>
                        </div>
                        <button onClick={handleEndWorkout}>End Workout</button>
                    </div>
                </Modal>
                </div>
            </div>
        </main>  
    );
};

export default CustomCalendar;