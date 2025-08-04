import React from "react";
import Progress  from "../components/grades/Progress";
import { BookOpen, School, Target } from "lucide-react";

const GradesPage = () => {
  return (
    <div className="min-h-screen p-6 font-sans text-gray-800">
      
      {/* Bienvenida */}
      <div className="text-center mb-5">
        <h1 className="text-4xl font-extrabold text-platform-darkblue">¡Bienvenido a Mi Escuelita!</h1>
        <p className="mt-2 text-lg">Un espacio para aprender, crecer y brillar </p>
      </div>

      {/* Misión y Visión */}
      <div className="grid md:grid-cols-2 gap-6 mb-5">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-orange-400">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Misión</h2>
          <p>
            Brindar una educación accesible, divertida y personalizada para que cada estudiante alcance su máximo potencial.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-green-400">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><School size={20} /> Visión</h2>
          <p>
            Ser la plataforma líder de apoyo escolar en la región, formando estudiantes seguros, curiosos y comprometidos.
          </p>
        </div>
      </div>

      {/* Asignaciones recientes */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-platform-darkblue mb-4">Asignaturas a las que se ha accedido recientemente:</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {["Matemáticas", "Español", "Estudios Sociales"].map((subject, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-300 hover:shadow-xl transition"
            >
              <h3 className="text-lg font-bold text-blue-800">{subject}</h3>
              <p className="text-sm text-gray-600 mt-1">¡Haz clic para saber más!</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progreso */}
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-platform-darkblue mb-4">Tu progreso:</h2>
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <Progress value={75} label="Progreso en Español" />
          <Progress value={90} label="Progreso en Matemáticas" />
          <Progress value={45} label="Progreso en Estudios Sociales" />
        </div>
      </div>

      {/* Eslogan */}
      <div className="text-center mt-16 mb-3">
        <blockquote className="text-xl italic text-gray-600">"Un espacio donde aprender es divertido, enseñar es fácil y crecer es una aventura para todos."</blockquote>
      </div>
    </div>
  );
};

export default GradesPage;
