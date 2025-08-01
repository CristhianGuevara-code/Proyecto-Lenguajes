import { useState, useEffect } from "react";
import { Comment } from "./Comment";
import { MdDelete, MdEdit, MdOutlineSave, MdOutlineCancel, MdModeComment } from "react-icons/md";

export const ForumPostCard = ({ post, onAddComment, onDeletePost, onEditPost }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  useEffect(() => {
    onEditPost(post.id, { ...post, comments });
  }, [comments]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      text: commentText,
      author: "Estudiante",
    };

    setComments([...comments, newComment]);
    setCommentText("");
  };

  const editComment = (commentId, newText) => {
    const updatedComments = comments.map((c) =>
      c.id === commentId ? { ...c, text: newText } : c
    );
    setComments(updatedComments);
  };

  const deleteComment = (commentId) => {
    const updatedComments = comments.filter((c) => c.id !== commentId);
    setComments(updatedComments);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedPost = {
      ...post,
      title: editedTitle,
      content: editedContent,
      comments,
      imageUrl: post.imageUrl,
    };
    onEditPost(post.id, updatedPost);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-6 border-l-4 border-blue-400 w-full">
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            className="border p-2 w-full mb-2 rounded"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            className="border p-2 w-full mb-2 rounded"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="flex gap-2 mb-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition duration-200"
            >
              <MdOutlineSave className="text-base"/>
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-1 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              <MdOutlineCancel className="text-base"/>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <h2 className="text-xl font-bold text-blue-600">{post.title}</h2>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Imagen del post"
              className="max-w-full h-auto rounded mb-4"
            />
          )}

          <p className="text-gray-700 mt-2">{post.content}</p>
          <div className="mt-2 text-sm text-gray-500">Escrito por: {post.author}</div>

          <div className="flex gap-3 mt-4 mb-6">
            <button
              onClick={() => onDeletePost(post.id)}
              className="bg-red-500 text-white px-4 py-1 flex items-center gap-2 rounded-lg text-sm hover:bg-red-600 transition duration-200"
            >
              <MdDelete className="text-base" />
              Eliminar
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-yellow-600 transition duration-200"
            >
              <MdEdit className="text-base"/>
              Editar
            </button>
          </div>

          <div>
            {comments.length === 0 && (
              <p className="text-gray-400 text-sm mb-2">Sin comentarios aún.</p>
            )}
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                onEditComment={editComment}
                onDeleteComment={deleteComment}
              />
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
                <MdModeComment className="text-base"/>
                Comentar
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
