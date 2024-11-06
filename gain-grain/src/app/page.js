"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Feed from "../components/Feed";
import './homepage.css';

export default function Home() {
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
          setFollowedUserPosts(Array.isArray(data) ? data : []); 
        } else {
          console.error("Error fetching followed user posts:", data.message);
          setFollowedUserPosts([]); 
        }
      } catch (error) {
        console.error("Error:", error);
        setFollowedUserPosts([]); 
      }
    };

    fetchFollowedUserPosts();
  }, [user]);

  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts/get-posts");
        const data = await response.json();
        
        if (response.ok) {
          setPosts(Array.isArray(data) ? data : []); 
        } else {
          console.error("Error fetching posts:", data.message);
          setPosts([]); 
        }
      } catch (error) {
        console.error("Error:", error);
        setPosts([]); 
      }
    };

    fetchPosts();
  }, []);

  
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

  
  const toggleComments = (postId) => {
    setVisibleComments((currentId) => (currentId === postId ? null : postId));
  };

  return (
    <main className="homepage-main flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <Feed 
        posts={[...(posts || []), ...(followedUserPosts || [])]} 
        toggleComments={toggleComments} 
        visibleComments={visibleComments} 
      />
    </main>
  );
}
