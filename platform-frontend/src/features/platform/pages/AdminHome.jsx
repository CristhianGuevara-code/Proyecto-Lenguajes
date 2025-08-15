import { Link } from "react-router-dom";
import { UserPlus, UserCog, ClipboardList, LayoutDashboard, Users } from "lucide-react";

export const AdminHome = () => {
    return (
        <div className="min-h-screen p-6 font-sans text-gray-800">

            {/* Bienvenida */}
            <div className="text-center mb-5">
                <h1 className="text-4xl font-extrabold text-platform-darkblue">¡Bienvenido, Administrador!</h1>
                <p className="mt-2 text-lg">Gracias por gestionar Mi Escuelita.</p>
            </div>

            {/* Misión y Visión */}
            <div className="grid md:grid-cols-2 gap-6 mb-5">
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-orange-400">
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><UserCog size={20} /> Misión</h2>
                    <p>
                        Facilitar la creación y gestión de usuarios y maestros, asegurando que todos tengan acceso a las herramientas necesarias para transformar la educación.
                    </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-green-400">
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Visión</h2>
                    <p>
                        Convertirnos en el pilar tecnológico que impulsa la educación organizada y accesible para todos los miembros de la plataforma.
                    </p>
                </div>
            </div>

            {/* Panel de Gestión */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold text-platform-darkblue mb-4">Panel de Gestión:</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    
                    <Link
                        to="/teacher">
                        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-teal-400 hover:shadow-xl transition cursor-pointer">
                            <ClipboardList size={20} /> Gestionar Maestro
                            <p className="text-sm text-gray-600 mt-1">Añadir nuevos maestros a la plataforma.</p>
                        </div>
                    </Link>
                    <Link
                        to="/user">
                        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-pink-400 hover:shadow-xl transition cursor-pointer">
                            <Users size={20} /> Gestionar Usuarios
                            <p className="text-sm text-gray-600 mt-1">Ver, editar o eliminar usuarios registrados.</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Eslogan */}
            <div className="text-center mt-16 mb-3">
                <blockquote className="text-xl italic text-gray-600">"Administrar es coordinar esfuerzos para garantizar el éxito educativo."</blockquote>
            </div>
        </div>
    );
};

export default AdminHome;
