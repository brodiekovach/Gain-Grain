"use client";

import React, { useEffect, useState} from "react"; 
import styles from './profile.module.css'
import { useSearchParams } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from 'next/image';

export default function profile() {
  const [user, setUser] = useState('');
  const [validId, setValidId] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  useEffect(() => {
    const fetchUserData = async () => {

      if (!userId) {
        return;
      }
      
      try {
        const response = await fetch('/api/profile/get-user-by-id', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          setValidId(true);
        }
      } catch (error) {

      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className={styles.wrapper}>
      <Navbar />
      {validId ? (
        <>
          <div className="flex flex-col items-center p-4">
            <div className="w-24 h-24">
              {user.profilePic ? (
                <Image src={user.profilePic} width={150} height={150} className="rounded-full w-full h-full object-cover"/>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>
              )}
            </div>
            <div className={styles.profile}>
              <h1 className={styles.username}>{user.username} </h1>
              <div className="flex justify-between space-x-4 mt-2">
              <p>Followers: <strong>{user.numFollowers}</strong></p>
              <p>Following: <strong>{user.numFollowing}</strong></p>
            </div>
              <p className="mt-4 text-center">
                <p>{user.bio}</p>
              </p>
              <div className="flex flex-col items-center w-full mt-6">
              <button className={styles.followButton}>Follow</button>
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
            {activeTab === 'posts' && user.posts && user.posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {user.posts.map((post) => (
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
            ) : (
              <div className="mt-4 text-center">
                <p>{`Showing ${activeTab.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.loginWrapper}>
          <Link href="/login">
            <button className={styles.loginButton}>
            Login/Register
            </button>
          </Link>
        </div>
      )}
    </div>
  )
};
