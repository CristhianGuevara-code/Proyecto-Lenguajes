import { useEffect, useState } from "react";

export const RightPanel = () => {
  const [asignaturas, setAsignaturas] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("asignaturas");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAsignaturas(parsed);
    }
  }, []);

  return (
    <div className="hidden w-4/12 lg:block">
      {/*Inicio Sección de Profesor*/}
      <div className="px-8">
        <h2 className="mb-4 text-2xl font-bold text-platform-darkblue">
          Contactar con mi profesor:
        </h2>
        <div className="flex flex-col max-w-sm py-4 mx-auto bg-platform-brightblue rounded-md">
          <ul>
            <li className="flex items-center mt-6 overflow-hidden">
              <img
                className="object-cover w-20 h-20 rounded-full flex-shrink-0"
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Avatar"
              />
              <div className="flex flex-col text-lg leading-tight overflow-hidden mx-4">
                <a
                  href="https://web.whatsapp.com/"
                  className="text-platform-darkblue font-bold hover:text-platform-strawberrypink hover:underline truncate"
                  title="Sadith Gomez - Cel: 9876-1234"
                >
                  Sadith Gomez
                </a>
                <span className="text-gray-500">Cel: 9876-1234</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/*Fin Sesión de Profesor */}

      {/*Inicio Sección de Categorías */}
      <div className="px-8 mt-10">
        <h2 className="mb-4 text-2xl text-platform-darkblue font-bold text-gray-600">
          Mis asignaturas:
        </h2>

        <div className="flex flex-col text-lg max-w-sm p-4 mx-auto bg-platform-brightblue rounded-md">
          <ul>
            {asignaturas.length === 0 ? (
              <li className="text-gray-500 italic">No hay asignaturas registradas.</li>
            ) : (
              asignaturas.map((asig) => (
                <li key={asig.id} className="mb-2">
                  <a
                    className="mx-1 font-bold text-platform-darkblue hover:text-platform-strawberrypink hover:underline"
                    href="#"
                  >
                    {asig.titulo}
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      {/*Fin sección de categorías */}
    </div>
  );
};
