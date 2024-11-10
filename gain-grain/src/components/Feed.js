import Post from './Post';  // Import the new Post component
import { useState } from 'react';

export default function Feed({ posts, toggleComments, visibleComments }) {
  const [expandedPostId, setExpandedPostId] = useState(null);

  const handlePostClick = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null); // Collapse if already expanded
    } else {
      setExpandedPostId(postId); // Expand the clicked post
    }
  };

  return (
    <div className="flex justify-center mt-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full">
        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            toggleComments={toggleComments}
            visibleComments={visibleComments}
            isExpanded={expandedPostId === post._id}
            handlePostClick={handlePostClick}
          />
        ))}
      </div>
    </div>
  );
}

