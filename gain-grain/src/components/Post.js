export default function Post({ post, toggleComments, visibleComments }) {
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
            <div className="post-content p-3">
              <h4 className="text-xl">Progress Picture</h4>
              <img
                src={post.progressPic}
                alt="User Progress"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          );
  
        default:
          return null;
      }
    };
  
    return (
      <div key={post._id} className="relative post bg-white border border-gray-300 mb-5 rounded-lg w-full">
        <div className="post-header flex items-center p-3">
          <img src="https://via.placeholder.com/40" alt="User Profile" className="rounded-full mr-2" />
          <h3 className="text-lg">@{post.author}</h3>
        </div>
        {renderPostContent(post)}
        <div className="post-actions flex justify-around mb-3">
          <button className="hover:underline">Like</button>
          <button className="hover:underline" onClick={() => toggleComments(post._id)}>Comment</button>
          <button className="hover:underline">Share</button>
        </div>
        {visibleComments === post._id && <Comments comments={post.comments} />}
      </div>
    );
  }
  