import Post from './Post';  // Import the new Post component
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Feed({ posts, toggleComments, visibleComments }) {
  const pathname = usePathname();

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

  return (
    <div className="flex justify-center mt-8 w-full">
      {isProfilePage ? (
        <div className="grid grid-cols-3 gap-6 max-w-7xl w-full">
        {posts.map((post) => (
          <Post
            classname="w-[60%] mx-auto"
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
        {posts.map((post) => (
          <Post
            classname="w-[60%] mx-auto"
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

