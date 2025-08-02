import React from "react";
import Progress  from "../components/grades/Progress";
import { BookOpen, School, Target } from "lucide-react";

const GradesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-white p-6 font-sans text-gray-800">
      
      {/* Bienvenida */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-orange-600">¡Bienvenido a Mi Escuelita! 🎓</h1>
        <p className="mt-2 text-lg">Un espacio para aprender, crecer y brillar ✨</p>
      </div>

      {/* Misión y Visión */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
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
        <h2 className="text-2xl font-semibold text-orange-700 mb-4">📘 Últimas asignaciones</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {["Matemáticas", "Ciencias", "Lenguaje"].map((subject, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-300 hover:shadow-xl transition"
            >
              <h3 className="text-lg font-bold text-blue-800">{subject}</h3>
              <p className="text-sm text-gray-600 mt-1">Nueva tarea publicada. ¡Haz clic para saber más!</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progreso */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-orange-700 mb-4">📊 Tu progreso</h2>
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <Progress value={75} label="Progreso mensual" />
          <Progress value={90} label="Progreso en Matemáticas" />
          <Progress value={45} label="Progreso en Ciencias" />
        </div>
      </div>

      {/* Frase motivadora */}
      <div className="text-center mt-16 mb-8">
        <blockquote className="text-xl italic text-gray-600">"Nunca es tarde para aprender cosas nuevas. ¡Tú puedes!"</blockquote>
      </div>
    </div>
  );
};

export default GradesPage;
