import { useNavigate } from 'react-router-dom'; // Usamos useNavigate para la navegación

const ParentHome = () => {
  const navigate = useNavigate(); // Usamos useNavigate para la navegación

  const navigateToGuides = () => {
    navigate('/guides'); // Esto lleva a la página de Guides
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-green-200 to-green-300 p-6 font-sans text-gray-800">
      {/* Bienvenida */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-green-700">
          ¡Bienvenido a tu Portal de Padres!
        </h1>
        <p className="mt-2 text-lg text-gray-600">Accede a toda la información relevante sobre tu hijo.</p>
      </div>

      {/* Tarjeta de Asignaciones */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center border-l-4 border-green-500 hover:shadow-2xl transition cursor-pointer">
        <h3 className="text-xl font-semibold text-green-700">Revisa las Asignaciones de tu Hijo</h3>
        <p className="mt-3 text-gray-600">Consulta las tareas y actividades que el profesor ha subido para su evaluación.</p>
        <button 
          onClick={navigateToGuides} 
          className="mt-4 bg-green-500 text-white rounded-lg py-2 px-6 text-lg font-semibold hover:bg-green-600 transition"
        >
          Ver Asignaciones
        </button>
      </div>

      {/* Eslogan */}
      <div className="text-center mt-16 mb-3">
        <blockquote className="text-xl italic text-gray-600">
          "Tu apoyo es clave para el éxito de tu hijo. Juntos, logramos más."
        </blockquote>
      </div>
    </div>
  );
};

export default ParentHome;
