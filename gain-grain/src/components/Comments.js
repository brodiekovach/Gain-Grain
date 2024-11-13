import React from 'react';

export default function Comments({ comments }) {
  if (!comments || !Array.isArray(comments)) {
    return <div>No comments yet.</div>;  // Fallback in case there are no comments
  }

  return (
    <div className="comments-container flex flex-col ml-4">
      {comments.length === 0 ? (
        <div>No comments yet.</div>
      ) : (
        comments.map((comment, index) => (
          <div key={index} className="comment bg-white p-3 rounded-lg mt-3 w-64">
            <p>{comment.text}</p>
          </div>
        ))
      )}
    </div>
  );
}
