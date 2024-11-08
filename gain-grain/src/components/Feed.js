import Post from './Post';  // Import the new Post component

export default function Feed({ posts, toggleComments, visibleComments }) {
  return (
    <div className="flex justify-center mt-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full">
        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            toggleComments={toggleComments}
            visibleComments={visibleComments}
          />
        ))}
      </div>
    </div>
  );
}

