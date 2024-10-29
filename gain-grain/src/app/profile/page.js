"use client";

import React, { useEffect, useState} from "react"; 
import styles from './profile.module.css'
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from 'next/image';
import dumbbell from '../../../public/images/dumbbell.png'
import foodicon from '../../../public/images/foodicon.png'

export default function profile() {
  const [user, setUser] = useState('');
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts/get-posts"); // Adjust route as needed
        const data = await response.json();
        
        if (response.ok) {
          setPosts(data); // Set posts if fetch is successful
        } 
        else {
          console.error("Error fetching posts:", data.message);
        }
      } 
      catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPosts();
  }, []);

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
          setUser(data.user);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchSavedWorkouts = async () => {
      try {
          const response = await fetch('/api/workouts/getSavedWorkouts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user?._id }),
          });
          const data = await response.json();
          if (data.success) {
              setSavedWorkouts(data.workouts);
          }
      } catch (error) {
          console.error('Error fetching saved workouts:', error);
      }
      setLoadingWorkouts(false);
    };

    if (user) fetchSavedWorkouts();
  }, [user]);

  const toggleWorkoutExpand = (workoutId) => {
    setExpandedWorkouts((prev) => ({
        ...prev,
        [workoutId]: !prev[workoutId],
    }));
};

  return (
    <div className={styles.wrapper}>
      <Navbar />
        <div className="flex flex-col items-center p-4">
          <div className="w-24 h-24">
            {user.profilePic ? (
              <Image src={user.profilePic} width={150} height={150} className="rounded-full w-full h-full object-cover"/>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </svg>
            )}
          </div>
          <div className={styles.profile}>
            <h1 className={styles.username}>{user.username} </h1>
            <div className="flex justify-between space-x-4 mt-2">
            <p>Followers: <strong>{user.numFollowers}</strong></p>
            <p>Following: <strong>{user.numFollowing}</strong></p>
          </div>
            {user.bio ? (
              <p className="mt-4 text-center">{user.bio}</p>
            ) : (
              <p></p>
            )}
            <div className="flex flex-col items-center w-full mt-6">
            <Link href="/edit-profile">
            <button className={styles.editButton}>Edit profile</button>
            </Link>
            </div>
          </div>

        </div>

        {/* Navigation Bar for Switching Tabs */}
        <div className="mt-4">
          <div className="flex justify-around border-b">
            <button
              className={`py-2 px-4 ${activeTab === 'posts' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'savedWorkouts' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
              onClick={() => setActiveTab('savedWorkouts')}
            >
              Saved Workouts
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'savedMeals' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
              onClick={() => setActiveTab('savedMeals')}
            >
              Saved Meals
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'likedPosts' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
              onClick={() => setActiveTab('likedPosts')}
            >
              Liked Posts
            </button>
          </div>
        </div>

        {/* Posts Grid or No Posts Message */}
        <div className="mt-8">
        {/* {activeTab === 'posts' && user.posts && user.posts.length > 0 ? ( */}
        {activeTab === 'posts' && posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">

            {posts.map((post) => (
              <div key={post.id} className="bg-blue-200 h-32 rounded-lg flex justify-center items-center">
                <p className="text-center text-white">{post.title || "Post"}</p>
              </div>
            ))}
            
          </div>
        ) : activeTab === 'posts' ? (
          <div className="flex flex-col items-center mt-4 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-camera-video-off mb-2" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518zM1.428 4.18A1 1 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634zM15 11.73l-3.5-1.555v-4.35L15 4.269zm-4.407 3.56-10-14 .814-.58 10 14z" />
            </svg>
            <p>No posts available.</p>
          </div>
        ) : activeTab === 'savedWorkouts' && loadingWorkouts ? (
          <p>Loading workouts...</p>
      ) : activeTab === 'savedWorkouts' && savedWorkouts.length === 0 ? (
          <div className="flex flex-col items-center mt-4 text-center text-gray-500">
              <Image src={dumbbell} width={32} height={32} alt="Dumbbell" className="mb-2"/>
              <p>No saved workouts.</p>
          </div>
      ) : activeTab === 'savedWorkouts' ? (
          <div className="grid grid-cols-2 gap-4">
              {savedWorkouts.map((workout) => (
                  <div key={workout._id} className="bg-gray-200 p-4 rounded-lg">
                      <h3 className="cursor-pointer font-semibold" onClick={() => toggleWorkoutExpand(workout._id)}>
                                    {workout.title}
                                </h3>
                      <p>Exercises: {workout.exercises.length}</p>
                      {expandedWorkouts[workout._id] && (
                                    <ul className="mt-2">
                                        {workout.exercises.map((exercise, index) => (
                                            <li key={index} className="text-gray-700 ml-4">
                                                • {exercise.name} - {exercise.reps} reps, {exercise.sets} sets
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
      ) : activeTab === 'savedMeals' && (!user.savedMeals || user.savedMeals.length === 0) ? (
          <div className="flex flex-col items-center mt-4 text-center text-gray-500">
              <Image src={foodicon} width={45} height={45} alt="Cooking food" className="mb-2"/>
              <p>No saved meals.</p>
          </div>
      ) : activeTab === 'likedPosts' && (!user.likedPosts || user.likedPosts.length === 0) ? (
          <div className="flex flex-col items-center mt-4 text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
              </svg>
              <p>No liked posts.</p>
          </div>
      ) : (
          <div className="mt-4 text-center">
              <p>{`Showing ${activeTab.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}</p>
          </div>
      )}
  </div>
</div>
);
}