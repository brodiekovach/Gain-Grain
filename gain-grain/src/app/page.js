"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Feed from "../components/Feed";
import './homepage.css';

export default function Home() {
  const [user, setUser] = useState('');
  const [followedUserPosts, setFollowedUserPosts] = useState([]); 
  const [visibleComments, setVisibleComments] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile/get-user-from-session');
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
    const fetchFollowedUserPosts = async () => {
      try {
        const response = await fetch('/api/posts/get-followed-user-posts', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user._id }),
        });

        const result = await response.json();
        
        if (result.success) {
          setFollowedUserPosts(result.posts); 
        } else {
          console.error("Error fetching followed user posts:", result.message);
          setFollowedUserPosts([]); 
        }
      } catch (error) {
        console.error("Error:", error);
        setFollowedUserPosts([]); 
      }
    };

    fetchFollowedUserPosts();
  }, [user]);

  const toggleComments = (postId) => {
    setVisibleComments((currentId) => (currentId === postId ? null : postId));
  };

  return (
    <main className="homepage-main flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <Feed 
        posts={[...(followedUserPosts || [])]} 
        toggleComments={toggleComments} 
        visibleComments={visibleComments} 
      />
    </main>
  );
}
