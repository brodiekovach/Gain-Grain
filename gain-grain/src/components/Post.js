import { FaDumbbell, FaCameraRetro, FaPencilAlt } from 'react-icons/fa';
import { MdOutlineFastfood } from "react-icons/md";
import { useState, useEffect } from 'react';
import Link from "next/link";
import Comments from './Comments'

export default function Post({ post, toggleComments, visibleComments, isExpanded, handlePostClick, onSavePost, isSaved }) {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState('');
  const [date, setDate] = useState('');
  const [liked, setLiked] = useState(false);

  // Fetch the user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile/get-user-from-session', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.success) {
          setUserId(data.user._id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

  // Fetch the user data for the post
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch('/api/profile/get-user-by-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: post.userId })
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsername();
  }, [post.userId]);

  // Set the date in a human-readable format
  useEffect(() => {
    const parsePostDate = () => {
      const postDate = new Date(post.date);
      const now = new Date();
      const diffInSeconds = Math.floor((now - postDate) / 1000);
      const secondsInMinute = 60;
      const secondsInHour = 3600;
      const secondsInDay = 86400;

      if (diffInSeconds < secondsInMinute) setDate(`${diffInSeconds} seconds ago`);
      else if (diffInSeconds < secondsInHour) setDate(`${Math.floor(diffInSeconds / secondsInMinute)} minutes ago`);
      else if (diffInSeconds < secondsInDay) setDate(`${Math.floor(diffInSeconds / secondsInHour)} hours ago`);
      else setDate(postDate.toLocaleDateString());
    };
    parsePostDate();
  }, [post.date]);

  useEffect(() => {
    if (userId && post?.likeCount) {
      setLiked(post.likeCount.includes(userId));
    }
  }, [userId, post.likeCount]);

  // Functions to like/unlike posts
  const likePost = async (e) => {
    e.stopPropagation();
    setLiked(true);
    await fetch('/api/posts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, postId: post._id, like: true })
    });
  };

  const unlikePost = async (e) => {
    e.stopPropagation();
    setLiked(false);
    await fetch('/api/posts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, postId: post._id, like: false })
    });
  };

  const renderPostContent = (post) => {
    switch (post.postType) {
      case "Workout":
        return (
          <div className="post-content p-3">
            <h4 className="text-3xl font-semibold">{post.title}</h4>
            {post.exercises?.map((exercise) => (
              <div key={exercise._id} className="exercise-info mt-1">
                <p className="indent-[20px] text-xl">{exercise.name}</p>
                <p className="indent-[45px] text-xl">Sets: {exercise.sets}</p>
                <p className="indent-[45px] text-xl">Reps: {exercise.reps}</p>
              </div>
            ))}
          </div>
        );
      case "Meal":
        return (
          <div className="post-content p-3">
            {post.meal?.map((item) => (
              <div key={item._id} className="meal-info mt-1">
                <h4 className="text-3xl font-semibold">{item.name}</h4>
                <p className="indent-[20px] text-xl"><span className="font-bold">Calories: </span>{item.calories} kcal</p>
                <p className="indent-[20px] text-xl"><span className="font-bold">Protein: </span>{item.protein}g</p>
                <p className="indent-[20px] text-xl"><span className="font-bold">Carbs: </span>{item.carbs}g</p>
                <p className="indent-[20px] text-xl"><span className="font-bold">Fats: </span>{item.fats}g</p>
              </div>
            ))}
          </div>
        );
      case "Blog":
        return (
          <div className="post-content p-3 text-xl font-bold">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        );
      case "ProgressPic":
        return (
          <div className="post-content p-3 flex justify-center items-center">
            <img src={post.progressPic} alt="Progress" className="w-full max-w-xs rounded-lg object-cover" style={{ maxHeight: '300px' }} />
          </div>
        );
      default:
        return null;
    }
  };

  const postColor = {
    Workout: "#4CAF50",
    Meal: "#FF5722",
    ProgressPic: "#3F51B5",
    Blog: "#FFC107",
  }[post.postType] || "#FFFFFF";

  return (
    <div className="relative flex justify-center mx-auto" style={{ 
      width: '100%', 
      maxWidth: '60vw',
    }}>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 pointer-events-none">
        </div>
      )}
      <div
        key={post._id}
        className={`post bg-white mb-5 rounded-lg w-full flex flex-col flex-shrink-0 min-w-0  ${isExpanded ? 'expanded' : ''}`}
        style={{
          width: '60vw',  // Set max width for the post
          minHeight: '350px',  // Set minimum height to maintain consistency
          flexDirection: 'column',
          boxSizing: 'border-box',
          borderColor: postColor, // Apply the color dynamically
          borderWidth: '3px', // Increase the border width here
          zIndex: isExpanded ? 40 : 1,
          position: isExpanded ? 'fixed' : 'relative', // Use absolute positioning for expansion
          top: isExpanded ? '50%' : 'auto', // Center vertically
          left: isExpanded ? '50%' : 'auto', // Center horizontally
          transform: isExpanded ? 'translate(-50%, -50%) scale(1.1)' : 'none', // Scale up when expanded
          transformOrigin: 'center',
          transition: 'transform 0.2s ease, z-index 0s', // Smooth transition for expansion
        }}
        onClick={() => handlePostClick(post._id)}
      >
        <div className="post-header flex items-center p-3">
          <Link href={`/search/profile?userId=${user._id}`}>
            <img
              src={user.profilePic}
              alt="User Profile"
              className="rounded-full mr-2"
              style={{ width: '40px', height: '40px' }}
            />
          </Link>
          <h3 className="text-3xl font-bold hover:underline">
            <Link href={`/search/profile?userId=${user._id}`}>@{user.username}</Link>
          </h3>
          {/* Icon in the top right */}
          <div className="absolute top-3 right-3 text-2xl cursor-pointer" style={{ color: postColor }}>
            {post.postType === "Workout" && <FaDumbbell />}
            {post.postType === "Meal" && <MdOutlineFastfood />}
            {post.postType === "ProgressPic" && <FaCameraRetro />}
            {post.postType === "Blog" && <FaPencilAlt />}
          </div>
        </div>
        <div className="space-x-2 flex flex-col h-full">
          <h5 className="text-right pr-5 text-m mb-[-10px]">{date}</h5>
          <div className="flex-grow max-w-[100%] break-words whitespace-normal">{renderPostContent(post)}</div>
          <div className="post-actions flex justify-around mt-auto pb-5">
            <button onClick={(e) => (liked ? unlikePost(e) : likePost(e))} className="text-xl font-semibold">{liked ? "Unlike" : "Like"}</button>
            <button onClick={() => toggleComments(post._id)} className="text-xl font-semibold">Comment</button>
            <button onClick={(e) => { e.stopPropagation(); onSavePost(post._id); }} className="text-xl font-semibold">{isSaved ? "Saved" : "Save"}</button>
          </div>
          {visibleComments === post._id && <Comments comments={post.comments} />}
        </div>
      </div>
    </div>
  );
}
