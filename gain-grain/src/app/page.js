"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Feed from "../components/Feed";
import './homepage.css';

export default function Home() {
  // State for managing posts and which post's comments are visible
  const [posts, setPosts] = useState([]);
  const [visibleComments, setVisibleComments] = useState(null);

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts/getPosts"); // Adjust route as needed
        const data = await response.json();
        
        if (response.ok) {
          setPosts(data); // Set posts if fetch is successful
        } else {
          console.error("Error fetching posts:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPosts();
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
