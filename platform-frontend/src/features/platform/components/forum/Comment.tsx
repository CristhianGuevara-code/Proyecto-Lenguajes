// src/features/platform/components/forum/Comment.jsx
export const Comment = ({ comment }) => {
  return (
    <div className="bg-gray-100 p-2 rounded mb-2">
      <p className="text-gray-800">{comment.content}</p>
      <div className="text-xs text-gray-500">- {comment.author}</div>
    </div>
  );
};
