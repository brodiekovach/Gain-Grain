import { FaDumbbell, FaCameraRetro, FaPencilAlt, FaHeart, FaComment, FaBookmark  } from 'react-icons/fa';
import { MdOutlineFastfood } from "react-icons/md";
import { useState, useEffect } from 'react';
import Link from "next/link";
import Comments from './Comments'
import { usePathname } from 'next/navigation';

export default function Post({ post, toggleComments, visibleComments, isExpanded, handlePostClick, onSavePost, isSaved }) {
  const pathname = usePathname();

  const [userId, setUserId] = useState('');
  const [user, setUser] = useState('');
  const [date, setDate] = useState('');
  const [liked, setLiked] = useState(false);
  const [isProfilePage, setIsProfilePage] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!commentText.trim()) return;

    try {
      const response = await fetch('/api/posts/add-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post._id,
          userId: userId,
          content: commentText
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setComments([...comments, data.comment]);
        setCommentText('');
        setIsCommenting(false);
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
              <div className="post-content" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h4 className="text-3xl text-center font-bold">{post.title}</h4>
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
                <h4 className="text-3xl font-semibold text-center pt-12">{post.title}</h4>
              </div>
            ) : (
              <div className="post-content p-3 text-xl">
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
              <div className="post-content" style={{ 
                height: isExpanded ? '200px' : '250px', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}>
                <img 
                  src={post.progressPic} 
                  alt="Progress" 
                  style={{ 
                    maxHeight: isExpanded ? '400px' : '260px',
                    paddingTop: isExpanded ? '0px' : '10px',
                    paddingBottom: isExpanded ? '0px' : '10px',
                    width: 'auto',
                    objectFit: 'contain',
                    borderRadius: '0.5rem'
                  }} 
                />
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

  const renderCommentSection = () => (
    <div className="comments-section p-4 border-t">
      {post.comments && post.comments.length > 0 && (
        <div className="mb-4">
          {post.comments.map((comment, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded mb-2">
              <p className="font-semibold">{comment.username}</p>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleCommentSubmit} className="mt-4">
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );

  const handleCommentClick = (e) => {
    e.stopPropagation();
    handlePostClick(post._id);
    toggleComments(post._id);
    setIsCommenting(!isCommenting);
  };

  return (
    <div className="w-full flex justify-center px-4">
      {isProfilePage ? (
        <div className="relative flex justify-center mx-auto" style={{
          width: '100%',
          maxWidth: '50vw',
          margin: '0 auto',
          position: 'relative',
        }}>
          {isExpanded && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 pointer-events-none">
            </div>
          )}
          <div
            key={post._id}
            className={`post bg-white mb-5 rounded-lg w-full flex flex-col flex-shrink-0 min-w-0 ${isExpanded ? 'expanded' : ''}`}
            style={{
              width: isExpanded ? '45vw' : '100%',
              height: isExpanded ? '80vh' : '350px',
              flexDirection: 'column',
              boxSizing: 'border-box',
              borderColor: postColor,
              borderWidth: '3px',
              zIndex: isExpanded ? 40 : 1,
              position: isExpanded ? 'fixed' : 'relative',
              top: isExpanded ? '50%' : 'auto',
              left: isExpanded ? '35%' : 'auto',
              transform: isExpanded ? 'translate(-50%, -50%)' : 'none',
              transformOrigin: 'center',
              transition: 'all 0.2s ease',
            }}
            onClick={() => handlePostClick(post._id)}
          >
            <div className="post-header flex items-center p-3">
              <img
                src={user.profilePic}
                alt="User Profile"
                className="rounded-full mr-2"
                style={{ width: '40px', height: '40px' }}
              />
              <h3 className="text-3xl font-bold">@{user.username}</h3>
              <div className="absolute top-3 right-3 text-2xl cursor-pointer" style={{ color: postColor }}>
                {post.postType === "Workout" && <FaDumbbell />}
                {post.postType === "Meal" && <MdOutlineFastfood />}
                {post.postType === "ProgressPic" && <FaCameraRetro />}
                {post.postType === "Blog" && <FaPencilAlt />}
              </div>
            </div>
            <div className="space-x-2 flex flex-col h-full">
              <h5 className="text-right pr-5 text-m z-10" style={{ marginTop: '-15px' }}>{date}</h5>
              <div className="flex-grow max-w-[100%] break-words whitespace-normal">{renderPostContent(post)}</div>
              {isExpanded && (
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
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onSavePost(post._id); 
                    }}
                    className="text-3xl font-semibold"
                  >
                    <FaBookmark
                      style={{ color: isSaved ? 'yellow' : 'gray', transition: 'color 0.3s' }}
                      className={isSaved ? 'filled-bookmark' : 'outlined-bookmark'}
                    />
                  </button>
                </div>
              )}
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
            className={`post bg-white mb-5 rounded-lg w-full flex flex-col flex-shrink-0 min-w-0 ${isExpanded ? 'expanded' : ''}`}
            style={{
              width: isExpanded ? '45vw' : '60vw',
              minHeight: '350px',
              flexDirection: 'column',
              boxSizing: 'border-box',
              borderColor: postColor,
              borderWidth: '3px',
              zIndex: isExpanded ? 40 : 1,
              position: isExpanded ? 'fixed' : 'relative',
              top: isExpanded ? '50%' : 'auto',
              left: isExpanded ? '35%' : 'auto',
              transform: isExpanded ? 'translate(-50%, -50%)' : 'none',
              transformOrigin: 'center',
              transition: 'all 0.2s ease',
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
              {isExpanded && (
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
                  <button 
                    onClick={handleCommentClick} 
                    className="text-3xl font-semibold"
                  >
                    <FaComment 
                      style={{ color: visibleComments === post._id ? 'blue' : 'gray', transition: 'color 0.3s' }}
                      className="text-gray-600" 
                    />
                  </button>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onSavePost(post._id); 
                    }}
                    className="text-3xl font-semibold"
                  >
                    <FaBookmark
                      style={{ color: isSaved ? 'yellow' : 'gray', transition: 'color 0.3s' }}
                      className={isSaved ? 'filled-bookmark' : 'outlined-bookmark'}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isExpanded && (
        <div 
          className="comments-section bg-white rounded-lg p-4 border-2"
          style={{
            position: 'fixed',
            top: '50%',
            left: '70%',
            transform: 'translate(-50%, -50%)',
            width: '25vw',
            maxHeight: '80vh',
            overflowY: 'auto',
            zIndex: 41,
            borderColor: postColor,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold mb-4">Comments</h3>
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-4 mb-4">
              {post.comments.map((comment, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold">{comment.username}</p>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-4">No comments yet</p>
          )}

          <form onSubmit={handleCommentSubmit} className="sticky bottom-0 bg-white pt-4">
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
