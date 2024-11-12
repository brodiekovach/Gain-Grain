import { FaDumbbell, FaCameraRetro, FaPencilAlt } from 'react-icons/fa';
import { MdOutlineFastfood } from "react-icons/md";
import { useState, useEffect } from 'react';
import Link from "next/link";

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

  // Fetch the username
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
  }, [userId]);

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
            <h4 className="text-xl font-semibold">{post.title}</h4>
            {post.exercises?.map((exercise) => (
              <div key={exercise._id} className="exercise-info mt-1">
                <p>{exercise.name}</p>
              </div>
            ))}
          </div>
        );
      case "Meal":
        return (
          <div className="post-content p-3">
            {post.meal?.map((item) => (
              <div key={item._id} className="meal-info mt-1">
                <p>{item.name}</p>
                <p>Calories: {item.calories} kcal</p>
                <p>Protein: {item.protein}g</p>
                <p>Carbs: {item.carbs}g</p>
                <p>Fats: {item.fats}g</p>
              </div>
            ))}
          </div>
        );
      case "Blog":
        return <div dangerouslySetInnerHTML={{ __html: post.content }} />;
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
    <div className="relative" style={{ width: '100%', maxWidth: '400px' }}>
      {isExpanded && <div className="fixed inset-0 bg-black opacity-50 z-9"></div>}
      <div
        className={`post bg-white mb-5 rounded-lg w-full`}
        style={{ borderColor: postColor, borderWidth: '3px' }}
        onClick={() => handlePostClick(post._id)}
      >
        <div className="post-header flex items-center p-3">
          <Link href={`/search/profile?userId=${user._id}`}>
            <img src={user.profilePic} alt="User Profile" className="rounded-full mr-2" style={{ width: '40px', height: '40px' }} />
          </Link>
          <h3 className="text-2xl font-bold hover:underline">
            <Link href={`/search/profile?userId=${user._id}`}>@{user.username}</Link>
          </h3>
          <span className="text-sm">{date}</span>
        </div>
        {renderPostContent(post)}
        <div className="post-actions flex justify-around mt-auto">
          <button onClick={(e) => (liked ? unlikePost(e) : likePost(e))}>{liked ? "Unlike" : "Like"}</button>
          <button onClick={() => toggleComments(post._id)}>Comment</button>
          <button onClick={(e) => { e.stopPropagation(); onSavePost(post._id); }}>{isSaved ? "Saved" : "Save"}</button>
        </div>
        {visibleComments === post._id && <Comments comments={post.comments} />}
      </div>
    </div>
  );
}
