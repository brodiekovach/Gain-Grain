import Post from './Post';  // Import the new Post component
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Feed({ posts, toggleComments, visibleComments }) {
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [isProfilePage, setIsProfilePage] = useState(false);

  useEffect(() => {
    if(pathname) {
      setIsProfilePage(pathname === '/profile');
    }
  }, [pathname]);

  const handlePostClick = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null); // Collapse if already expanded
    } else {
      setExpandedPostId(postId); // Expand the clicked post
    }
  };

  const handleSavePost = async (postId) => {
    try {
      console.log('Attempting to save post:', postId);

      const response = await fetch('/api/posts/save-posts-to-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSavedPosts(prev => [...prev, postId]);
        alert('Post saved successfully!');
      } else {
        alert(data.message || 'Failed to save post');
      }
    } catch (error) {
      console.error('Full error:', error);
      alert(`Error saving post: ${error.message}`);
    }
  };

  // Modified filter function to handle 'all' category
  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.postType === selectedCategory);

  return (
    <div className="flex flex-col items-center mt-8 w-full">
      {/* Category Selection Menu */}
      <div className="flex justify-center space-x-4 mb-8 w-full">
        <button
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'all'
              ? 'bg-[#58B8ED] text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'Workout'
              ? 'bg-[#58B8ED] text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setSelectedCategory('Workout')}
        >
          Workouts
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'Meal'
              ? 'bg-[#58B8ED] text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setSelectedCategory('Meal')}
        >
          Meals
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'Blog'
              ? 'bg-[#58B8ED] text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setSelectedCategory('Blog')}
        >
          Blogs
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'ProgressPic'
              ? 'bg-[#58B8ED] text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setSelectedCategory('ProgressPic')}
        >
          Progress Pics
        </button>
      </div>

      {/* Posts Grid */}
      {isProfilePage ? (
        <div className="grid grid-cols-3 gap-6 max-w-7xl w-full">
          {filteredPosts.map((post) => (
            <Post
              classname="w-full h-[350px]"
              key={post._id}
              post={post}
              toggleComments={toggleComments}
              visibleComments={visibleComments}
              isExpanded={expandedPostId === post._id}
              handlePostClick={handlePostClick}
              onSavePost={handleSavePost}
              isSaved={savedPosts.includes(post._id)}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 max-w-7xl w-full">
          {filteredPosts.map((post) => (
            <Post
              classname="w-[60%] mx-auto h-[350px]"
              key={post._id}
              post={post}
              toggleComments={toggleComments}
              visibleComments={visibleComments}
              isExpanded={expandedPostId === post._id}
              handlePostClick={handlePostClick}
              onSavePost={handleSavePost}
              isSaved={savedPosts.includes(post._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

