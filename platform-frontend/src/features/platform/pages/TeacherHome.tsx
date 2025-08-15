import { Link } from "react-router-dom";
import { BookOpen, School, Target, ClipboardList, Megaphone, LayoutDashboard } from "lucide-react";

export const TeacherHome = () => {
    return (
        <div className="min-h-screen p-6 font-sans text-gray-800">

            {/* Bienvenida */}
            <div className="text-center mb-5">
                <h1 className="text-4xl font-extrabold text-platform-darkblue">¡Bienvenido, Maestro!</h1>
                <p className="mt-2 text-lg">Gracias por ser parte de Mi Escuelita.</p>
            </div>

            {/* Misión y Visión */}
            <div className="grid md:grid-cols-2 gap-6 mb-5">
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-orange-400">
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Misión</h2>
                    <p>
                        Ofrecer a los docentes herramientas sencillas e intuitivas para enriquecer la experiencia educativa y potenciar el aprendizaje de sus estudiantes.
                    </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-green-400">
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><School size={20} /> Visión</h2>
                    <p>
                        Ser la plataforma preferida por los maestros para organizar, motivar y transformar su aula digital.
                    </p>
                </div>
            </div>

            {/* Panel de Gestión */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold text-platform-darkblue mb-4">Panel de Gestión:</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <Link
                        to="/subjects">
                        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-indigo-400 hover:shadow-xl transition cursor-pointer">
                            <h3 className="text-lg font-bold text-indigo-800 flex items-center gap-2">
                                <LayoutDashboard size={20} /> Gestionar Asignaturas
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">Crea, edita o elimina las materias que impartes.</p>
                        </div>
                    </Link>
                    <Link
                        to="/guides">
                        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-teal-400 hover:shadow-xl transition cursor-pointer">
                            <h3 className="text-lg font-bold text-teal-800 flex items-center gap-2">
                                <ClipboardList size={20} /> Gestionar Asignaciones
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">Publica tareas o ejercicios para tus alumnos.</p>
                        </div>
                    </Link>
                    <Link
                        to="/consultation">
                        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-pink-400 hover:shadow-xl transition cursor-pointer">
                            <h3 className="text-lg font-bold text-pink-800 flex items-center gap-2">
                                <Megaphone size={20} /> Crear Aviso en el Foro
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">Comparte anuncios importantes con tu clase.</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Eslogan */}
            <div className="text-center mt-16 mb-3">
                <blockquote className="text-xl italic text-gray-600">"Educar es sembrar con sabiduría y cosechar con pasión."</blockquote>
            </div>
        </div>
    );
};

export default TeacherHome;
