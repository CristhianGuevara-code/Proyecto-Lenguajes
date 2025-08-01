import { useState } from "react";

export const PostForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    let imageUrl: string | null = null;
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }

    onSubmit({
      title,
      content,
      author: "Docente",
      imageUrl,
    });

    setTitle("");
    setContent("");
    setImageFile(null);
    e.target.reset(); // limpia input file
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 w-full">
      <input
        className="border p-2 w-full mb-2 rounded"
        placeholder="Título del post"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full mb-2 rounded"
        placeholder="Escribe aquí tu mensaje..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-2"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Publicar
      </button>
    </form>
  );
};
