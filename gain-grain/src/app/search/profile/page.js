"use client";

import React, { useEffect, useState} from "react"; 
import styles from './profile.module.css'
import Navbar from "@/components/Navbar";
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Feed from "@/components/Feed";
import Post from '@/components/Post';

export default function profile() {
  const [user, setUser] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [following, setFollowing] = useState(false);
  const [visibleComments, setVisibleComments] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isProfilePicExpanded, setIsProfilePicExpanded] = useState(false);

  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile/get-user-by-id', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId })
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
  }, [userId]);

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
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const followingResponse = await fetch('/api/profile/following', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentUser, user })
        });

        const result = await followingResponse.json();

        if(result.following) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [user, currentUser]);

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

  const toggleProfilePic = () => {
    setIsProfilePicExpanded(!isProfilePicExpanded);
  };

  const toggleComments = (postId) => {
    setVisibleComments(currentId => currentId === postId ? null : postId);
  };
  
  const handleFollowUnfollow = async() => {
    try {
      const response = await fetch('/api/profile/follow-unfollow-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, currentUser, following })
      });

      const data = await response.json();

      if (data.success) {
        setFollowing(!following);
        showAlert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showAlert = (message) => {
    const alertContainer = document.getElementById('alert-container');
    const alertMessage = document.getElementById('alert-message');

    alertMessage.textContent = message;
    alertContainer.classList.remove('hidden');

    setTimeout(() => {
      alertContainer.classList.add('hidden');
    }, 10000);

    document.getElementById('alert-close').addEventListener('click', () => {
      alertContainer.classList.add('hidden');
    });
};


  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div id="alert-container" className={`${styles.alert} hidden`}>
          <span id="alert-message"></span>
          <button id="alert-close">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
          </button> {}
      </div>
      {isProfilePicExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleProfilePic}>
          <div className="flex justify-center items-center h-full">
            <Image src={user.profilePic} width={300} height={300} className="rounded-full object-cover" />
          </div>
        </div>
      )}
      <div className="flex flex-col items-center p-4">
        <div className="w-24 h-24" onClick={toggleProfilePic}>
          {user.profilePic ? (
            <Image src={user.profilePic} width={150} height={150} className="rounded-full w-full h-full object-cover" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
            </svg>
          )}
        </div>
        <div className={styles.profile}>
          <h1 className={styles.username}>{user.username}</h1>
          <div className="flex flex-row justify-center space-x-4 mt-2">
            <p>Followers: <strong>{user.numFollowers}</strong></p>
            <p>Following: <strong>{user.numFollowing}</strong></p>
          </div>
          {user.bio && (
            <p className="mt-4 text-center max-w-xs overflow-hidden text-ellipsis">{user.bio}</p>
          )}
          <div className="flex flex-col items-center w-full mt-6">
            {following ? (
                <button className={styles.followButton} onClick={() => handleFollowUnfollow()}>Unfollow</button>
              ) : (
                <button className={styles.followButton} onClick={() => handleFollowUnfollow()}>Follow</button>
              )
            }
          </div>
        </div>
      </div>

        {/* Posts Display */}
        {posts.length > 0 ? (
          <Feed 
            posts={[...(posts || [])]} 
            toggleComments={toggleComments} 
            visibleComments={visibleComments} 
          />
        ) : (
          <div className="flex flex-col items-center mt-4 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-camera-video-off mb-2" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518zM1.428 4.18A1 1 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634zM15 11.73l-3.5-1.555v-4.35L15 4.269zm-4.407 3.56-10-14 .814-.58 10 14z" />
            </svg>
            <p>No posts available.</p>
          </div>
        )}
    </div>
  );
}