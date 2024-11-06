import Post from './Post';  // Import the new Post component

export default function Feed({ posts, toggleComments, visibleComments }) {
  return (
    <div className="flex justify-center mt-8 w-full">
      <div className="flex flex-col items-center max-w-2xl w-full">
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
