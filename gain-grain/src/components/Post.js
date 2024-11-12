import { FaDumbbell, FaCameraRetro, FaPencilAlt } from 'react-icons/fa';
import { MdOutlineFastfood } from "react-icons/md";

export default function Post({ post, toggleComments, visibleComments, isExpanded, handlePostClick, onSavePost, isSaved }) {
  const renderPostContent = (post) => {
    switch (post.postType) {
      case "Workout":
        return (
          <div className="post-content p-3">
            <h4 className="text-xl">{post.title}</h4>
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
            <h4 className="text-xl">Meal</h4>
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
        return (
          <div className="post-content p-3">
            <h4 className="text-xl">Blog</h4>
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
                className="w-full max-w-xs h-auto object-cover rounded-lg"
                style={{ maxHeight: '350px' }}
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
    <div className="relative" style={{ width: '100%', maxWidth: '400px' }}>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-9"
          style={{
            transition: 'opacity 0.3s ease', // Smooth transition for the dimming effect
          }}
        ></div>
      )}
    <div
      key={post._id}
      className={`relative post bg-white mb-5 rounded-lg w-full flex flex-col flex-shrink-0 min-w-0 ${isExpanded ? 'expanded' : ''}`}
      style={{
        maxWidth: '400px',  // Set max width for the post
        minHeight: '450px',  // Set minimum height to maintain consistency
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        borderColor: postColor, // Apply the color dynamically
        borderWidth: '3px', // Increase the border width here
        zIndex: isExpanded ? 10 : 1,
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
        <img
          src="https://via.placeholder.com/40"
          alt="User Profile"
          className="rounded-full mr-2"
          style={{ width: '40px', height: '40px' }}
        />
        <h3 className="text-lg">@{post.author}</h3>

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
      {renderPostContent(post)}
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
