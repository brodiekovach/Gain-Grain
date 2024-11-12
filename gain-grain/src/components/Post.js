import { FaDumbbell, FaCameraRetro, FaPencilAlt } from 'react-icons/fa';
import { MdOutlineFastfood } from "react-icons/md";
import { useState, useEffect } from 'react'
import Link from "next/link";

export default function Post({ post, toggleComments, visibleComments, onSavePost, isSaved }) {
  const [user, setUser] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile/get-user-by-id', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: post.userId })
        });

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchUserData();
  }, [post.userId]);

  useEffect(() => {
    const parsePostDate = () => {
      const date = new Date(post.date);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      const secondsInMinute = 60;
      const secondsInHour = 3600;
      const secondsInDay = 86400;
      const secondsInMonth = 2592000;
      const secondsInYear = 31536000;

      if(diffInSeconds < secondsInMinute) {
        setDate(`${diffInSeconds} seconds ago`);
      } else if (diffInSeconds < secondsInHour) {
        const minutes = Math.floor(diffInSeconds / secondsInMinute);
        setDate(`${minutes} minute${minutes !== 1 ? 's' : ''} ago`);
      } else if (diffInSeconds < secondsInDay) {
        const hours = Math.floor(diffInSeconds / secondsInHour);
        setDate(`${hours} hour${hours !== 1 ? 's' : ''} ago`);
      } else if (diffInSeconds < secondsInMonth) {
        const days = Math.floor(diffInSeconds / secondsInDay);
        setDate(`${days} day${days !== 1 ? 's' : ''} ago`);
      } else if (diffInSeconds < secondsInYear) {
        const months = Math.floor(diffInSeconds / secondsInMonth);
        setDate(`${months} month${months !== 1 ? 's' : ''} ago`);
      } else {
        const years = Math.floor(diffInSeconds / secondsInYear);
        setDate(`${years} year${years !== 1 ? 's' : ''} ago`);
      }
    }
      
    parsePostDate();
  }, [post.date]);

  const renderPostContent = (post) => {
    switch (post.postType) {
      case "Workout":
        return (
          <div className="post-content p-3">
            <h4 className="text-3xl font-semibold">{post.title}</h4>
            {post.exercises?.map((exercise) => (
              <div key={exercise._id} className="exercise-info mt-1">
                <p className="indent-[20px] text-xl">{exercise.name}</p>
              </div>
            ))}
          </div>
        );

      case "Meal":
        return (
          <div className="post-content p-3">
            {post.meal?.map((item) => (
              <>
                <h4 className="text-3xl font-semibold">{item.name}</h4>
                <div key={item._id} className="meal-info mt-1">
                  <p className="indent-[20px] text-xl"><span className="font-bold">Calories: </span>{item.calories} kcal</p>
                  <p className="indent-[20px] text-xl"><span className="font-bold">Protein: </span>{item.protein}g</p>
                  <p className="indent-[20px] text-xl"><span className="font-bold">Carbs: </span>{item.carbs}g</p>
                  <p className="indent-[20px] text-xl"><span className="font-bold">Fats: </span>{item.fats}g</p>
                </div>
              </>
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
            <div className="text-center">
              <img
                src={post.progressPic}
                alt="User Progress"
                className="w-full max-w-xs h-fill object-cover rounded-lg"
                style={{ maxHeight: '300px' }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Determine the post color based on post type
  const getPostColor = (postType) => {
    switch (postType) {
      case "Workout":
        return "#4CAF50"; // Green for Workout
      case "Meal":
        return "#FF5722"; // Orange for Meal
      case "ProgressPic":
        return "#3F51B5"; // Blue for Progress Pictures
      case "Blog":
        return "#FFC107"; // Yellow for Blog
      default:
        return "#FFFFFF"; // Default white color for unknown types
    }
  };

  // Get the color for the border based on post type
  const postColor = getPostColor(post.postType);

  return (
    <div className="relative flex justify-center mx-auto" style={{ 
      width: '100%', 
      maxWidth: '60vw',
    }}>
      <div
        key={post._id}
        className={`post bg-white mb-5 rounded-lg w-full flex flex-col flex-shrink-0 min-w-0`}
        style={{
          width: '60vw',  // Set max width for the post
          minHeight: '350px',  // Set minimum height to maintain consistency
          boxSizing: 'border-box',
          borderColor: postColor, // Apply the color dynamically
          borderWidth: '3px', // Increase the border width here
        }}
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
        <div
          className="absolute top-3 right-3 text-2xl cursor-pointer"
          style={{ color: postColor }}
        >
          {post.postType === "Workout" && <FaDumbbell />}
          {post.postType === "Meal" && <MdOutlineFastfood />}
          {post.postType === "ProgressPic" && <FaCameraRetro />}
          {post.postType === "Blog" && <FaPencilAlt />}
        </div>
      </div>
      <div className="space-x-2">
        <h5 className="text-right pr-5 text-m">{date}</h5>
        {renderPostContent(post)}
      </div>
      <div className="post-actions flex justify-around mb-3 mt-auto">
        <button className="hover:underline">Like</button>
        <button className="hover:underline" onClick={() => toggleComments(post._id)}>
          Comment
        </button>
        <button className="hover:underline">Share</button>
        <button 
          className={`hover:underline ${isSaved ? 'text-orange-500' : ''}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent post expansion when clicking save
            onSavePost(post._id);
          }}
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>
      {visibleComments === post._id && <Comments comments={post.comments} />}
    </div>
    </div>
  );
}
