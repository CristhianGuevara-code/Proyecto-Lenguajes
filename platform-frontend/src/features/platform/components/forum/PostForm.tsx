import { useState } from "react";

export const PostForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"consulta" | "aviso">("consulta");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, type, author: "Estudiante X" });
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
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
      <select
        value={type}
        onChange={(e) => setType(e.target.value as any)}
        className="border p-2 rounded mb-2 w-full"
      >
        <option value="consulta">Consulta</option>
        <option value="aviso">Aviso</option>
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Publicar
      </button>
    </form>
  );
};
