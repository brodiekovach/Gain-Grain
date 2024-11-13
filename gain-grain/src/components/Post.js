import { FaDumbbell, FaCameraRetro, FaPencilAlt, FaHeart, FaComment, FaBookmark  } from 'react-icons/fa';
import { MdOutlineFastfood } from "react-icons/md";
import { useState, useEffect } from 'react';
import Link from "next/link";
import Comments from './Comments'
import { usePathname } from 'next/navigation';

export default function Post({ post, toggleComments, visibleComments, isExpanded, handlePostClick, handleCommentClick, handleCommentSubmit,
                                onSavePost, isSaved }) {
  const pathname = usePathname();

  const [userId, setUserId] = useState('');
  const [user, setUser] = useState('');
  const [date, setDate] = useState('');
  const [liked, setLiked] = useState(false);
  const [isProfilePage, setIsProfilePage] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    if (pathname) {
      setIsProfilePage(pathname === '/profile');
    }
  }, [pathname]);

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
      const secondsInMonth = 2592000;
      const secondsInYear = 31536000;

      if (diffInSeconds < secondsInMinute) {
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
    };
    parsePostDate();
  }, [post.date]);

  useEffect(() => {
    if (userId && post?.likeArr) {
      setLiked(post.likeArr.includes(userId));
    }
  }, [userId, post.likeArr]);

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

  const addComment = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!commentText.trim()) return; // Prevent empty comments

    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, postId: post._id, comment: commentText })
      });

      const data = await response.json();

      if (data.success) {
        // Clear input and refresh comments
        setCommentText('');
        toggleComments(post._id); // Toggle comments to refresh
      } else {
        console.error('Failed to add comment:', data.message);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const renderPostContent = (post) => {
    switch (post.postType) {
      case "Workout":
        return (
          <div>
            {isProfilePage ? (
              <div className="post-content p-3">
                <h4 className="text-3xl text-center font-bold pt-12">{post.title}</h4>
              </div>
            ) : (
              <div className="post-content p-3">
                <h4 className="text-3xl font-bold pb-2">{post.title}</h4>
                {post.exercises?.map((exercise) => (
                  <div key={exercise._id} className="exercise-info mt-1">
                    <p className="indent-[20px] text-xl font-semibold">{exercise.name}</p>
                    <p className="indent-[45px] text-xl">Sets: {exercise.sets}</p>
                    <p className="indent-[45px] text-xl">Reps: {exercise.reps}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "Meal":
        return (
          <div>
            {isProfilePage ? (
              <div className="post-content p-3">
                {post.meal?.map((item) => (
                  <div key={item._id} className="meal-info mt-1">
                    <h4 className="text-3xl font-semibold text-center pt-11">{item.name}</h4>
                  </div>
                ))}
              </div>
            ) : (
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
            )}
          </div>
        );
      case "Blog":
        return (
          <div>
            {isProfilePage ? (
              <div className="post-content p-3 text-m font-bold">
                <h4 className="text-3xl font-semibold text-center pt-11">{post.title}</h4>
              </div>
            ) : (
              <div className="post-content p-3 text-xl font-bold">
                <h4 className="text-3xl font-semibold pb-3">{post.title}</h4>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            )}
          </div>
        );
      case "ProgressPic":
        return (
          <div>
            {isProfilePage ? (
              <div className="post-content flex justify-center items-center">
                <img src={post.progressPic} alt="Progress" className="w-full max-w-xs rounded-lg w-[65%] object-contain" style={{ maxHeight: '300px' }} />
              </div>
            ) : (
              <div className="post-content p-3 flex justify-center items-center">
                <img src={post.progressPic} alt="Progress" className="w-full max-w-xs rounded-lg object-cover" style={{ maxHeight: '300px' }} />
              </div>
            )}
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
    <div>
      {isProfilePage ? (
        <div className="flex flex-wrap justify-evenly mx-auto p-4" style={{ maxWidth: '95vw' }}>
          {isExpanded && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 pointer-events-none">
            </div>
          )}
          <div
            key={post._id}
            className={`relative post bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-200 ${isExpanded ? 'expanded z-40' : ''} w-full`}
            style={{
              height: '300px',
              width: '30vw',
              borderColor: postColor,
              borderWidth: '3px',
              position: isExpanded ? 'fixed' : 'relative',
              top: isExpanded ? '25%' : 'auto',
              left: isExpanded ? '35%' : 'auto',
              transform: isExpanded ? 'scale(1.5)' : 'none',
              zIndex: isExpanded ? 40 : 1,
            }}
            onClick={() => handlePostClick(post._id)}
          >
            <div className="post-header flex items-center p-3">
              {/* Icon in the top right */}
              <div className="absolute top-3 right-3 text-2xl cursor-pointer" style={{ color: postColor }}>
                {post.postType === "Workout" && <FaDumbbell />}
                {post.postType === "Meal" && <MdOutlineFastfood />}
                {post.postType === "ProgressPic" && <FaCameraRetro />}
                {post.postType === "Blog" && <FaPencilAlt />}
              </div>
            </div>
            <div className="space-x-2 flex flex-col h-full p-3">
              <h5 className="text-right text-m">{date}</h5>
              <div className="flex-grow max-w-full break-words whitespace-normal">{renderPostContent(post)}</div>

              <div className="post-actions flex justify-around mt-auto pb-4">
                <button
                  onClick={(e) => (liked ? unlikePost(e) : likePost(e))}
                  className="text-xl font-semibold"
                >
                  {liked ? "Unlike" : "Like"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComments(post._id);
                    setIsCommenting(!isCommenting);
                  }}
                  className="text-xl font-semibold"
                >
                  Comment
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSavePost(post._id);
                  }}
                  className="text-xl font-semibold"
                >
                  {isSaved ? "Saved" : "Save"}
                </button>
              </div>

              {/* Conditional input field for comments */}
              {isCommenting && visibleComments === post._id && (
                <form onSubmit={addComment} className="p-3">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-2 border rounded mb-2"
                  />
                  <button
                    type="submit"
                    onClick={(e) => e.stopPropagation()}  // Stop propagation here
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                </form>
              )}

              {/* Display existing comments */}
              {visibleComments === post._id && <Comments comments={post.comments} />}
            </div>
          </div>
        </div>
      ) : (
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
              {isProfilePage ? (
                <div></div>
              ) : (
                <div className="post-actions flex justify-around mt-auto pb-4">
                  <button
                    onClick={(e) => (liked ? unlikePost(e) : likePost(e))}
                    className="text-3xl font-semibold"
                  >
                    <FaHeart 
                      style={{ color: liked ? 'red' : 'gray', transition: 'color 0.3s' }}
                      className={liked ? 'filled-heart' : 'outlined-heart'}
                    />
                    </button>
                    <button onClick={handleCommentClick} className="text-3xl font-semibold">
                      <FaComment className="text-gray-600" />
                    </button>
                  <button onClick={(e) => { e.stopPropagation(); onSavePost(post._id); }}className="text-3xl font-semibold">
                    <FaBookmark
                      style={{ color: isSaved ? 'blue' : 'gray', transition: 'color 0.3s' }}
                      className={isSaved ? 'filled-bookmark' : 'outlined-bookmark'}
                  />
                  </button>
                </div>
              )}
              {visibleComments === post._id && <Comments comments={post.comments} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
