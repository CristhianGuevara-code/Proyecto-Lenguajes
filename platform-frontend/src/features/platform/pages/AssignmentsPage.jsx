import { useState, useEffect } from "react";

export const AssignmentsPage = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [completedTasks, setCompletedTasks] = useState({});

  useEffect(() => {
    // Cargar asignaturas
    const dataGuardada = localStorage.getItem("asignaturas");
    if (dataGuardada) {
      setAsignaturas(JSON.parse(dataGuardada));
    }

    // Cargar asignaciones
    const asignacionesGuardadas = localStorage.getItem("assignments");
    if (asignacionesGuardadas) {
      setAssignments(JSON.parse(asignacionesGuardadas));
    }

    // Cargar tareas completadas
    const tareasCompletadas = localStorage.getItem("completedTasks");
    if (tareasCompletadas) {
      setCompletedTasks(JSON.parse(tareasCompletadas));
    }

    const handleStorageChange = (e) => {
      if (e.key === "asignaturas") {
        const nuevas = e.newValue ? JSON.parse(e.newValue) : [];
        setAsignaturas(nuevas);
      }
      if (e.key === "assignments") {
        const nuevas = e.newValue ? JSON.parse(e.newValue) : [];
        setAssignments(nuevas);
      }
      if (e.key === "completedTasks") {
        const nuevas = e.newValue ? JSON.parse(e.newValue) : {};
        setCompletedTasks(nuevas);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Obtener tareas pendientes por asignatura
  const getPendientesPorAsignatura = (titulo) => {
    return assignments.filter(
      (a) => a.subject === titulo && !completedTasks[a.id]
    ).length;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de asignaturas</h2>
      {asignaturas.length === 0 ? (
        <p>No hay asignaturas creadas aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {asignaturas.map((asig) => {
            const pendientes = getPendientesPorAsignatura(asig.titulo);

            return (
              <div
                key={asig.id}
                className="w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
                style={{ backgroundColor: asig.color }}
              >
                <img
                  className="w-full h-40 object-cover"
                  src={asig.imagen}
                  alt={asig.titulo}
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {asig.titulo}
                  </h2>
                  <p className="text-sm text-gray-700 mt-2">
                    {pendientes === 0
                      ? "No hay tareas pendientes"
                      : `${pendientes} tarea${pendientes > 1 ? "s" : ""} pendiente${pendientes > 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
