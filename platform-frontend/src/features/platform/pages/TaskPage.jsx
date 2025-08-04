import { useEffect, useState } from "react";
import { FaFileDownload, FaEdit, FaTrash } from "react-icons/fa";

export const TaskPage = () => {
  const [assignments, setAssignments] = useState(() => {
    // ✅ Leer una sola vez al cargar
    const saved = localStorage.getItem("assignments");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    subject: "",
    fileBase64: "",
    fileName: "",
    fileType: "",
  });

  // ✅ Guardar en localStorage cada vez que cambie assignments
  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        fileBase64: reader.result,
        fileName: file.name,
        fileType: file.type,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!formData.title.trim()) return alert("Por favor, completa el título.");
    const newAssignment = {
      id: Date.now(),
      ...formData,
    };

    setAssignments((prev) => [newAssignment, ...prev]);

    // Limpiar formulario
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      subject: "",
      fileBase64: "",
      fileName: "",
      fileType: "",
    });

    document.getElementById("fileInput").value = "";
  };

  const handleDelete = (id) => {
    const confirmed = confirm(
      "¿Estás seguro de que deseas eliminar esta asignación? Esta acción no se puede deshacer."
    );
    if (confirmed) {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleEdit = (id) => {
    const task = assignments.find((a) => a.id === id);
    if (!task) return;

    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      subject: task.subject,
      fileBase64: task.fileBase64,
      fileName: task.fileName,
      fileType: task.fileType,
    });

    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="w-full lg:w-8/12 mx-auto p-4">
      <div className="bg-platform-lightcream p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold text-platform-darkblue mb-4">
          Nueva Asignación
        </h2>

        <label className="block font-semibold mb-1">Título:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block font-semibold mb-1">Descripción:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block font-semibold mb-1">Fecha de entrega:</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block font-semibold mb-1">Asignatura:</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block font-semibold mb-1">Archivo adjunto:</label>
        <input
          type="file"
          id="fileInput"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-green-600"
        >
          Guardar Asignación
        </button>
      </div>

      {/* Lista de tareas */}
      {assignments.map((task) => (
        <div
          key={task.id}
          className="max-w-4xl px-10 py-6 mx-auto bg-platform-lightcream rounded-lg shadow-md mb-5"
        >
          <div className="flex items-center justify-between">
            <span className="font-light text-gray-600">
              Fecha de entrega: {task.dueDate}
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-semibold text-platform-darkblue">
              {task.title}
            </h3>
            <p className="mt-2 text-gray-600">{task.description}</p>
            <p className="mt-2 text-sm text-gray-500 font-semibold">
              Asignatura: {task.subject}
            </p>

            {task.fileBase64 && (
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Archivo adjunto:</p>

                {task.fileType.startsWith("image/") ? (
                  <img
                    src={task.fileBase64}
                    alt="Archivo"
                    className="max-w-xs border rounded mb-2"
                  />
                ) : task.fileType === "application/pdf" ? (
                  <iframe
                    src={task.fileBase64}
                    title="PDF"
                    className="w-full h-64 border rounded mb-2"
                  />
                ) : null}

                <a
                  href={task.fileBase64}
                  download={task.fileName}
                  className="text-sm text-blue-600 underline"
                >
                  Descargar archivo
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <a
                href={task.fileBase64}
                download={task.fileName}
                className="px-2 py-1 flex items-center gap-2 font-bold text-platform-darkblue bg-yellow-300 rounded hover:bg-green-300"
              >
                <FaFileDownload />
                Descargar
              </a>
              <button
                onClick={() => handleEdit(task.id)}
                className="px-2 py-1 flex items-center gap-2 font-bold text-platform-darkblue bg-yellow-300 rounded hover:bg-green-300"
              >
                <FaEdit />
                Editar
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="px-2 py-1 flex items-center gap-2 font-bold text-platform-darkblue bg-red-300 rounded hover:bg-red-400"
              >
                <FaTrash />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskPage;
