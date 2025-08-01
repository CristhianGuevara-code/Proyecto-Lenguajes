import { Comment } from "./Comment";
import { useState } from "react";

export const ForumPostCard = ({ post, onAddComment }) => {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      content: commentText,
      author: "Estudiante X", // aquí puede ir dinámico si usas login
    };

    onAddComment(post.id, newComment);
    setCommentText("");
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-6 border-l-4 border-blue-400">
      <h2 className="text-xl font-bold text-blue-600">{post.title}</h2>
      <p className="text-gray-700">{post.content}</p>
      <div className="mt-2 text-sm text-gray-500">Escrito por: {post.author}</div>

      <div className="mt-4">
        <h3 className="font-semibold text-sm mb-2">Comentarios:</h3>
        {post.comments.length === 0 && <p className="text-gray-400 text-sm">Sin comentarios aún.</p>}
        {post.comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}

        <form onSubmit={handleCommentSubmit} className="mt-4 flex flex-col gap-2">
          <input
            className="border p-2 rounded"
            placeholder="Escribe un comentario..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 self-start"
          >
            Comentar
          </button>
        </form>
      </div>
    </div>
  );
};
