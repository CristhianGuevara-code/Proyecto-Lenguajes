import { useState } from "react";

export const Comment = ({ comment, onEditComment, onDeleteComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const handleSave = () => {
    if (!editedText.trim()) return;
    onEditComment(comment.id, editedText);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-100 p-2 rounded mb-2 w-full">
      {isEditing ? (
        <>
          <textarea
            className="border p-1 w-full rounded mb-2"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedText(comment.text);
              }}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-800">{comment.text}</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">- {comment.author}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 text-xs underline"
              >
                Editar
              </button>
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="text-red-600 text-xs underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
