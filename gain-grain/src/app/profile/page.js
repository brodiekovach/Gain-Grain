"use client";

import React, { useEffect, useState} from "react"; 
import styles from './profile.module.css'
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from 'next/image';
import dumbbell from '../../../public/images/dumbbell.png'
import foodicon from '../../../public/images/foodicon.png'
import Post from '@/components/Post';
import Feed from "@/components/Feed";

export default function profile() {
  const [user, setUser] = useState('');
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingSavedPosts, setLoadingSavedPosts] = useState(true);
  const [visibleComments, setVisibleComments] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);

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
    const fetchUserPosts = async () => {
      try {
        const response = await fetch("/api/posts/get-user-posts", {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user._id }),
        });

        const result = await response.json();
        
        if (result.success) {
          setPosts(result.posts);
          // console.log('Posts: ', result.posts); 
        } else {
          console.error("Error fetching user posts:", result.message);
          setPosts([]); 
        }
      } catch (error) {
        console.error("Error:", error);
        setPosts([]); 
      }
    };

    fetchUserPosts();
  }, [user]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!user._id) return;
      
      try {
        setLoadingSavedPosts(true);
        const response = await fetch('/api/posts/fetch-posts-from-profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch saved posts');
        }

        const data = await response.json();
        if (data.success) {
          setSavedPosts(data.savedPosts);
        }
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      } finally {
        setLoadingSavedPosts(false);
      }
    };

    if (user) {
      fetchSavedPosts();
    }
  }, [user]);


  const handlePostClick = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
    }
  };

  const toggleComments = (postId) => {
    setVisibleComments(currentId => currentId === postId ? null : postId);
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
              className={`py-2 px-4 ${activeTab === 'likedPosts' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
              onClick={() => setActiveTab('likedPosts')}
            >
              Liked Posts
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'savedPosts' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
              onClick={() => setActiveTab('savedPosts')}
            >
              Saved Posts
            </button>
          </div>
        </div>

        {/* Posts Grid or No Posts Message */}
        <div className="mt-8">
        {activeTab === 'posts' && posts.length > 0 ? (
          <Feed 
            posts={[...(posts || [])]} 
            toggleComments={toggleComments} 
            visibleComments={visibleComments} 
          />
        ) : activeTab === 'posts' ? (
          <div className="flex flex-col items-center mt-4 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-camera-video-off mb-2" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518zM1.428 4.18A1 1 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634zM15 11.73l-3.5-1.555v-4.35L15 4.269zm-4.407 3.56-10-14 .814-.58 10 14z" />
            </svg>
            <p>No posts available.</p>
          </div>
        ) : activeTab === 'likedPosts' && (!user.likedPosts || user.likedPosts.length === 0) ? (
          <div className="flex flex-col items-center mt-4 text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
              </svg>
              <p>No liked posts.</p>
          </div>
      ) : activeTab === 'savedPosts' && loadingSavedPosts ? (
        <div className="text-center mt-4">
          <p>Loading saved posts...</p>
        </div>
      ) : activeTab === 'savedPosts' && (!savedPosts || savedPosts.length === 0) ? (
        <div className="flex flex-col items-center mt-4 text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-bookmark mb-2" viewBox="0 0 16 16">
            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
          </svg>
          <p>No saved posts yet</p>
        </div>
      ) : activeTab === 'savedPosts' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {savedPosts.map((post) => (
            <Post
              key={post._id}
              post={post}
              toggleComments={toggleComments}
              visibleComments={visibleComments}
              isExpanded={expandedPostId === post._id}
              handlePostClick={handlePostClick}
              onSavePost={() => {}}
              isSaved={true}
            />
          ))}
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