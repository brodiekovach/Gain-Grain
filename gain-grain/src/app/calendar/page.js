// CustomCalendar.js
'use client';

import React, { useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight, FaPlus } from 'react-icons/fa';
import './custom_calendar.css'; 
import './style.css';
import ExerciseSearch from './exerciseSearch';
import Modal from './modal';
import TitleModal from './titleModal';
import Navbar from "../../components/Navbar";

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
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        initCalendar();
        loadExercisesForDate(selectedDate);
        loadMealsForDate(selectedDate);
    }, [currentMonth, selectedDate]);

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

    const loadExercisesForDate = (selectedDate) => {
        const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || {};
        const exercisesForDate = savedWorkouts[selectedDate.toDateString()]?.exercises || [];
        setSelectedExercises(exercisesForDate);
    };

    const loadMealsForDate = (selectedDate) => {
        const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || {};
        const mealsForDate = savedWorkouts[selectedDate.toDateString()]?.meals || [];
        setSelectedMeals(mealsForDate);
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
        const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || {};
        savedWorkouts[selectedDate.toDateString()] = { ...savedWorkouts[selectedDate.toDateString()], exercises };
        localStorage.setItem('workouts', JSON.stringify(savedWorkouts));
    };

    const saveMealsToLocalStorage = (meals) => {
        const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || {};
        savedWorkouts[selectedDate.toDateString()] = { ...savedWorkouts[selectedDate.toDateString()], meals };
        localStorage.setItem('workouts', JSON.stringify(savedWorkouts));
    };

    const handleAddMeal = () => {
        if (mealName && mealCalories && mealIngredients) {
            const newMeal = { name: mealName, calories: mealCalories, ingredients: mealIngredients, link:mealUrl, };
            const updatedMeals = [...selectedMeals, newMeal];
            setSelectedMeals(updatedMeals);
            saveMealsToLocalStorage(updatedMeals);
            setMealName('');
            setMealCalories('');
            setMealIngredients([]);
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
        if (!mealUrl) return; // Ensure URL is entered
    
        try {
            const response = await fetch('/api/meals/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: mealUrl }), // Use the mealUrl state variable
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message);
                return;
            }
    
            const data = await response.json();
            if (data.success) {
                setMealName(data.name);
                setMealCalories(data.calories);
                setMealIngredients(data.ingredients);
            }
        } catch (error) {
            console.error('Error fetching the recipe:', error);
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
            const MealData = {
                name: meal.name,
                ingredients: meal.ingredients,
                calories: meal.calories,
                link: meal.link,
            };
    
            const response = await fetch('/api/meals/saveToProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userId, 
                    meal: MealData, 
                    date: selectedDate // Ensure selectedDate is defined in the scope
                }),
            });
    
            const data = await response.json();
            if (data.success) {
                alert('Meal saved successfully!');
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error saving meal:', error);
            alert('Failed to save meal');
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
    
    const handleSelectMeal = (meal) => {

        const mealToAdd = {
            name: meal.meal.name,
            ingredients: meal.ingredients,
            calories: meal.meal.calories,
        };

        setSelectedMeals((prevMeals) => [...prevMeals, mealToAdd]);
        setMealOption('');
        toggleModal();
    }
    
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
                        <button className="add-button" onClick={toggleModal}>
                            <FaPlus />
                        </button>
                    </div>
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
                                    <input
                                        type="text"
                                        value={mealIngredients}
                                        onChange={(e) => setMealIngredients(e.target.value)}
                                        placeholder="Ingredients (optional)"
                                    />
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
                                            <button onClick={handleAddMeal}>Add Meal</button>
                                        </>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </Modal>
            </div>
        </main>
    );
};

export default CustomCalendar;