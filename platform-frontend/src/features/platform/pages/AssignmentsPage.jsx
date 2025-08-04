import { useState, useEffect } from "react";

export const AssignmentsPage = () => {
  const [asignaturas, setAsignaturas] = useState([]);

  useEffect(() => {
    // Cargar asignaturas desde localStorage al montar
    const dataGuardada = localStorage.getItem("asignaturas");
    if (dataGuardada) {
      setAsignaturas(JSON.parse(dataGuardada));
    }

    // Opcional: agregar listener para detectar cambios en localStorage desde otra pestaña
    const handleStorageChange = (e) => {
      if (e.key === "asignaturas") {
        const nuevasAsignaturas = e.newValue ? JSON.parse(e.newValue) : [];
        setAsignaturas(nuevasAsignaturas);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Alternativamente, para que el componente siempre se actualice cuando "asignaturas" cambie,
  // puedes agregar un pequeño setInterval que revise localStorage periódicamente.
  // Pero no suele ser necesario si solo usas una pestaña o recargas la página.

  return (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">Lista de asignaturas</h2>
    {asignaturas.length === 0 ? (
      <p>No hay asignaturas creadas aún.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {asignaturas.map((asig) => (
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
              <h2 className="text-xl font-semibold text-gray-800">{asig.titulo}</h2>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  );
};
export default AssignmentsPage;