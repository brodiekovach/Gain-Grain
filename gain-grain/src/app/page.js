"use client"

import { useState } from "react";
import Navbar from "../components/Navbar";
import Feed from "../components/Feed";
import './homepage.css';

export default function Home() {
  // State for managing which post's comments are visible
  const [visibleComments, setVisibleComments] = useState(null);

  // Toggle comments for the specific post
  const toggleComments = (postId) => {
    // If comments for this post are already visible, hide them. Otherwise, show the comments.
    if (visibleComments === postId) {
      setVisibleComments(null); // Close the comments if they are already open
    } else {
      setVisibleComments(postId); // Show comments for the specific post
    }
  };

  return (
    <main className="homepage-main flex min-h-screen flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar></Navbar>

      {/* Feed Section */}
      <Feed toggleComments={toggleComments} visibleComments={visibleComments} />

    </main>
  );
}
