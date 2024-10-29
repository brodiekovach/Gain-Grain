"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Feed from "../components/Feed";
import './homepage.css';

export default function Home() {
  // State for managing posts and which post's comments are visible
  const [user, setUser] = useState('');
  const [posts, setPosts] = useState([]);
  const [followedUserPosts, setFollowedUserPosts] = useState([]);
  const [visibleComments, setVisibleComments] = useState(null);

  useEffect(() => {
    if (!user._id) return;

    const fetchFollowedUserPosts = async () => {
      try {
        const response = await fetch(`/api/posts/get-followed-user-posts/${user._id}`);
        const data = await response.json();
        
        if (response.ok) {
          setFollowedUserPosts(data); // Set posts if fetch is successful
        } 
        else {
          console.error("Error fetching posts:", data.message);
        }
      } 
      catch (error) {
        console.error("Error:", error);
      }
    };
    console.log("User", user);
    fetchFollowedUserPosts();
  }, [user]);

  // Fetch posts on component mount
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

  // Toggle comments for the specific post
  const toggleComments = (postId) => {
    setVisibleComments((currentId) => (currentId === postId ? null : postId));
  };

  return (
    <main className="homepage-main flex min-h-screen flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Feed Section, passing posts and toggle functionality */}
      <Feed posts={posts} toggleComments={toggleComments} visibleComments={visibleComments} />
    </main>
  );
}
