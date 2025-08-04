import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaBook, FaGamepad, FaComments } from "react-icons/fa";
import { MdWorkspacePremium } from "react-icons/md";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <nav className="px-6 py-2 bg-platform-softyellow shadow-md">
      <div className="container flex flex-col mx-auto md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/platform" className="flex items-center">
              <img
                src="/logo.png"
                alt="Logo Mi Escuelita"
                className="h-16 md:h-20"
              />
            </Link>
          </div>
          <div>
            <button type="button"
              onClick={handleMenuToggle}
              className="block text-white hover:text-platform-strawberrypink md:hidden">
            </button>
          </div>
        </div>
        <div className={` ${isMenuOpen ? "flex " : "hidden"} flex-col md:flex md:flex-row md:mx-4`}>
          <Link
            to="/professor"
            className="my-1 flex items-center gap-2 text-platform-darkblue hover:text-platform-strawberrypink md:mx-4 md:my-0"
          >
            <FaHome className="text-lg" />
            Inicio
          </Link>

          <Link
            to="/grades"
            className="my-1 flex items-center gap-2 text-platform-darkblue hover:text-platform-strawberrypink md:mx-4 md:my-0"
          >
            <FaHome className="text-lg" />
            Inicio
          </Link>

          <Link
            to="/home"
            className="my-1 flex items-center gap-2 text-platform-darkblue hover:text-platform-strawberrypink md:mx-4 md:my-0"
          >
            <MdWorkspacePremium className="text-lg" />
            Asignaturas
          </Link>

          <Link
            to="/assignments"
            className="my-1 flex items-center gap-2 text-platform-darkblue hover:text-platform-strawberrypink md:mx-4 md:my-0"
          >
            <MdWorkspacePremium className="text-lg" />
            Asignaturas
          </Link>

          <Link
            to="/platform"
            className="my-1 flex items-center gap-2 text-platform-darkblue hover:text-platform-strawberrypink md:mx-4 md:my-0"
          >
            <FaBook className="text-lg" />
            Asignaciones
          </Link>

          <Link
            to="/task"
            className="my-1 flex items-center gap-2 text-platform-darkblue hover:text-platform-strawberrypink md:mx-4 md:my-0"
          >
            <FaBook className="text-lg" />
            Asignacionessss
          </Link>

          <Link
            to="/quiz"
            className="my-1 flex items-center gap-2 text-platform-darkblue hover:text-platform-strawberrypink md:mx-4 md:my-0"
          >
            <FaGamepad className="text-lg" />
            Área de juego
          </Link>

          <Link
            to="/consultation"
            className="my-1 flex items-center gap-2 text-platform-darkblue hover:text-platform-strawberrypink md:mx-4 md:my-0"
          >
            <FaComments className="text-lg" />
            Foro de Consultas
          </Link>
        </div>
      </div>
    </nav>
  );
}