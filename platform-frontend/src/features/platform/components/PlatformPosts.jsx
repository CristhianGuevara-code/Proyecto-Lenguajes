import { useEffect, useState } from "react";
import { FaFileDownload, FaCheckCircle, FaRegCircle } from "react-icons/fa";

export const PlatformPosts = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("assignments");
    const completed = localStorage.getItem("completedTasks") || "{}";

    if (saved) {
      const parsed = JSON.parse(saved);
      const completedMap = JSON.parse(completed);
      const withStatus = parsed.map((task) => ({
        ...task,
        completed: completedMap[task.id] || false,
      }));
      setAssignments(withStatus);
    }
  }, []);

  const toggleComplete = (id) => {
    const updated = assignments.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setAssignments(updated);

    const completionStatus = {};
    updated.forEach((task) => {
      completionStatus[task.id] = task.completed;
    });
    localStorage.setItem("completedTasks", JSON.stringify(completionStatus));
  };

  return (
    <div className="w-full lg:w-8/12">
      <h1 className="text-xl font-bold text-platform-darkblue md:text-2xl mb-6">
        Últimas asignaciones:
      </h1>

      {assignments.length === 0 ? (
        <p className="text-gray-600">No hay asignaciones disponibles.</p>
      ) : (
        assignments.map((task) => (
          <div
            key={task.id}
            className={`relative max-w-4xl px-10 py-6 mx-auto rounded-lg shadow-md mb-5 transition-colors ${
              task.completed
                ? "bg-green-100 border-green-300"
                : "bg-platform-lightcream"
            }`}
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

            {/* Botones abajo */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-4 items-center">
                <a
                  href={task.fileBase64}
                  download={task.fileName}
                  className="px-2 py-1 flex items-center gap-2 font-bold text-platform-darkblue bg-platform-softyellow rounded hover:bg-platform-mintgreen"
                >
                  <FaFileDownload className="text-lg" />
                  Descargar
                </a>

                <button
                  onClick={() => toggleComplete(task.id)}
                  className="check-btn text-2xl text-green-600 hover:text-green-800"
                  title="Marcar como completado"
                >
                  {task.completed ? <FaCheckCircle /> : <FaRegCircle />}
                </button>

                {task.completed && (
                  <span className="text-green-700 font-semibold text-sm">
                    Completado
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-600">Profesor(a)</h3>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
