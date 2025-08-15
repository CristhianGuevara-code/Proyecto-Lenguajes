import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaBars, FaTimes, FaHome, FaBook, FaGamepad, FaComments,
  FaUserGraduate, FaSignOutAlt, FaUser
} from "react-icons/fa";
import { MdWorkspacePremium } from "react-icons/md";
import { useAuthStore } from "../../stores/authStore";
import { Role } from "../../../infraestructure/enums/role.enum";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authenticated, roles, email, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isTeacher = useMemo(() => roles?.includes(Role.PROFESOR), [roles]);
  const isParent  = useMemo(() => roles?.includes(Role.PADRE), [roles]);
  const isAdmin  = useMemo(() => roles?.includes(Role.ADMIN), [roles]);

  const toggle = () => setIsMenuOpen((v) => !v);
  const close  = () => setIsMenuOpen(false);

  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  const underlineAnim =
    "relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-platform-strawberrypink after:transition-all after:duration-300 hover:after:w-full";

  const pillActive = "text-platform-strawberrypink bg-white/60 ring-1 ring-black/5";
  const pillIdle   = "text-platform-darkblue hover:text-platform-strawberrypink hover:bg-white/40";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `my-1 flex items-center gap-2 lg:mx-2 lg:my-0 rounded-xl px-3 py-2 transition-colors
     text-sm lg:text-base whitespace-nowrap ${underlineAnim} ${isActive ? pillActive : pillIdle}`;

  const handleLogout = () => {
    if (confirm("¿Cerrar sesión?")) {
      logout();
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-transparent backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4 py-3">
        {/* Card del navbar */}
        <div className="rounded-2xl bg-platform-softyellow/90 backdrop-blur shadow-xl ring-1 ring-black/5">
          <div className="px-4 lg:px-6 py-2">
            <div className="flex items-center justify-between">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <NavLink to="/platform" className="flex items-center" onClick={close}>
                  <img src="/logo.png" alt="Logo Mi Escuelita" className="h-16 lg:h-20" />
                </NavLink>
              </div>

              {/* Desktop menú + usuario */}
              {authenticated ? (
                <div className="hidden custom:flex items-center justify-between w-full ml-4">
                  {/* Links izquierda */}
                  <div className="flex items-center overflow-x-auto">
                    {isTeacher && (
                      <NavLink to="/teacherHome" className={linkClass} onClick={close}>
                        <FaHome className="text-lg" />
                        <span>Inicio</span>
                      </NavLink>
                    )}
                    {isParent && (
                      <NavLink to="/parentHome" className={linkClass} onClick={close}>
                        <FaHome className="text-lg" />
                        <span>Inicio</span>
                      </NavLink>
                    )}

                    {isAdmin && (
                      <>
                      <NavLink to="/adminHome" className={linkClass} onClick={close}>
                        <FaHome className="text-lg" />
                        <span>Inicio</span>
                      </NavLink>

                      <NavLink to="/teacher" className={linkClass} onClick={close}>
                        <FaHome className="text-lg" />
                        <span>Maestros</span>
                      </NavLink>

                      <NavLink to="/user" className={linkClass} onClick={close}>
                        <FaHome className="text-lg" />
                        <span>Usuarios</span>
                      </NavLink>
                      </>
                    )}

                    {isTeacher && (
                      <>
                        <NavLink to="/subjects" className={linkClass} onClick={close}>
                          <MdWorkspacePremium className="text-lg" />
                          <span>Asignaturas</span>
                        </NavLink>

                        <NavLink to="/students" className={linkClass} onClick={close}>
                          <FaUserGraduate className="text-lg" />
                          <span>Estudiantes</span>
                        </NavLink>

                        <NavLink to="/parentPage" className={linkClass} onClick={close}>
                          <FaBook className="text-lg" />
                          <span>Padres</span>
                        </NavLink>
                      </>
                    )}

                    <NavLink to="/guides" className={linkClass} onClick={close}>
                      <FaComments className="text-lg" />
                      <span>Guías</span>
                    </NavLink>

                    <NavLink to="/quiz" className={linkClass} onClick={close}>
                      <FaGamepad className="text-lg" />
                      <span>Área de juego</span>
                    </NavLink>

                    <NavLink to="/consultation" className={linkClass} onClick={close}>
                      <FaComments className="text-lg" />
                      <span>Foro de Consultas</span>
                    </NavLink>
                  </div>

                  {/* Usuario + logout */}
                  <div className="flex items-center gap-3 ml-3">
                    <div className="flex items-center gap-3 bg-white/80 rounded-full px-3 py-1 shadow ring-1 ring-black/5">
                      <FaUser className="text-platform-darkblue" />
                      <div className="text-sm">
                        <div className="text-platform-darkblue font-semibold leading-4 max-w-[200px] truncate">
                          {email ?? "Usuario"}
                        </div>
                        <div className="text-[12px] text-gray-600 leading-4 hidden sm:block">
                          {roles?.join(" • ") || "Sin rol"}
                        </div>
                      </div>
                    </div>

                    <button
                      className="flex items-center gap-3 text-white bg-red-600 hover:bg-red-700
                      rounded-md px-4 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2
                      focus-visible:ring-red-300"
                      onClick={handleLogout}
                      >
                      <FaSignOutAlt className="text-base" />
                      <span className="text-sm">EXIT</span>
                    </button>



                  </div>
                </div>
              ) : null}

              {/* Botón móvil (hasta < lg) */}
              {authenticated ? (
                <button
                  type="button"
                  onClick={toggle}
                  aria-controls="mobile-menu"
                  aria-expanded={isMenuOpen}
                  className="custom:hidden text-platform-darkblue hover:text-platform-strawberrypink
                             text-xl p-1 rounded-md focus:outline-none
                             focus-visible:ring-2 focus-visible:ring-platform-strawberrypink"
                  aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                >
                  {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay móvil */}
      {authenticated && (
        <div
          className={`lg:hidden fixed inset-0 z-40 bg-black/40 transition-opacity
                     ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Panel móvil */}
      {authenticated && (
        <div
          id="mobile-menu"
          className={`lg:hidden fixed top-[100px] left-0 right-0 z-50 mx-4 rounded-2xl
                     bg-platform-softyellow/95 backdrop-blur shadow-2xl ring-1 ring-black/10 overflow-hidden
                     transition-[max-height,opacity,transform]
                     ${isMenuOpen ? "max-h-[80vh] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}
        >
          <div className="p-3">
            {/* Bloque usuario */}
            <div className="flex items-center gap-3 bg-white/70 rounded-xl px-3 py-2 mb-2 ring-1 ring-black/5">
              <FaUser className="text-platform-darkblue" />
              <div className="text-sm">
                <div className="text-platform-darkblue font-semibold leading-4">
                  {email ?? "Usuario"}
                </div>
                <div className="text-[12px] text-gray-600 leading-4">
                  {roles?.join(" • ") || "Sin rol"}
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col">
              {isTeacher && (
                <NavLink to="/home" className={linkClass} onClick={close}>
                  <FaHome className="text-lg" />
                  <span>Inicio</span>
                </NavLink>
              )}
              {isParent && (
                <NavLink to="/home" className={linkClass} onClick={close}>
                  <FaHome className="text-lg" />
                  <span>Inicio</span>
                </NavLink>
              )}
              {isTeacher && (
                <>
                  <NavLink to="/subjects" className={linkClass} onClick={close}>
                    <MdWorkspacePremium className="text-lg" />
                    <span>Asignaturas</span>
                  </NavLink>
                  <NavLink to="/students" className={linkClass} onClick={close}>
                    <FaUserGraduate className="text-lg" />
                    <span>Estudiantes</span>
                  </NavLink>
                  <NavLink to="/parentPage" className={linkClass} onClick={close}>
                    <FaBook className="text-lg" />
                    <span>Padres</span>
                  </NavLink>
                </>
              )}

              {isAdmin && (
                      <>
                      <NavLink to="/home" className={linkClass} onClick={close}>
                        <FaHome className="text-lg" />
                        <span>Inicio</span>
                      </NavLink>

                      <NavLink to="/teacher" className={linkClass} onClick={close}>
                        <FaHome className="text-lg" />
                        <span>Maestros</span>
                      </NavLink>

                      <NavLink to="/user" className={linkClass} onClick={close}>
                        <FaHome className="text-lg" />
                        <span>Usuarios</span>
                      </NavLink>
                      </>
                    )}

              <NavLink to="/quiz" className={linkClass} onClick={close}>
                <FaGamepad className="text-lg" />
                <span>Área de juego</span>
              </NavLink>

              <NavLink to="/consultation" className={linkClass} onClick={close}>
                <FaComments className="text-lg" />
                <span>Foro de Consultas</span>
              </NavLink>
            </div>

            {/* Logout */}
            <button
              className="flex items-center gap-3 text-white bg-red-600 hover:bg-red-700
              rounded-md px-4 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2
              focus-visible:ring-red-300"
              onClick={handleLogout}
              >
              <FaSignOutAlt className="text-base" />
              <span className="text-sm">EXIT</span>
            </button>




          </div>
        </div>
      )}
    </nav>
  );
};


/* import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaBars, FaTimes, FaHome, FaBook, FaGamepad, FaComments,
  FaUserGraduate, FaSignOutAlt, FaUser
} from "react-icons/fa";
import { MdWorkspacePremium } from "react-icons/md";
import { useAuthStore } from "../../stores/authStore";
import { Role } from "../../../infraestructure/enums/role.enum";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authenticated, roles, email, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isTeacher = useMemo(() => roles?.includes(Role.PROFESOR), [roles]);
  const isParent  = useMemo(() => roles?.includes(Role.PADRE), [roles]);
  const isAdmin  = useMemo(() => roles?.includes(Role.ADMIN), [roles]);

  const toggle = () => setIsMenuOpen((v) => !v);
  const close  = () => setIsMenuOpen(false);

  // Cierra menú al cambiar de ruta
  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  // Subrayado animado (utiliza ::after)
  const underlineAnim =
    "relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-platform-strawberrypink after:transition-all after:duration-300 hover:after:w-full";

  const pillActive = "text-platform-strawberrypink bg-white/60 ring-1 ring-black/5";
  const pillIdle   = "text-platform-darkblue hover:text-platform-strawberrypink hover:bg-white/40";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `my-1 flex items-center gap-2 lg:mx-2 lg:my-0 rounded-xl px-3 py-2 transition-colors
     text-sm lg:text-base whitespace-nowrap ${underlineAnim} ${isActive ? pillActive : pillIdle}`;

  const handleLogout = () => {
    if (confirm("¿Cerrar sesión?")) {
      logout();
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-3">
        {/* Card del navbar 
        <div className="rounded-2xl bg-platform-softyellow/90 backdrop-blur shadow-xl ring-1 ring-black/5">
          <div className="px-4 lg:px-6 py-2">
            <div className="flex items-center justify-between">
              {/* Brand *
              <div className="flex items-center gap-3">
                <NavLink to="/platform" className="flex items-center" onClick={close}>
                  <img src="/logo.png" alt="Logo Mi Escuelita" className="h-16 lg:h-20" />
                </NavLink>
              </div>

              {/* Desktop menú + usuario *
              {authenticated ? (
                <div className="hidden custom:flex items-center justify-between w-full ml-4">
                  {/* Links izquierda *
                  <div className="flex items-center overflow-x-auto">
                    {isTeacher && (
                      <NavLink to="/teacherHome" className={linkClass} onClick={close}>
                        <FaHome className="text-lg" />
                        <span>Inicio</span>
                      </NavLink>
                    )}
                    {isParent && (
                      <NavLink to="/parentHome" className={linkClass} onClick={close}>
                        <FaHome className="text-lg" />
                        <span>Inicio</span>
                      </NavLink>
                      
                    )}

                    {isAdmin && (
                      <>
                      <NavLink to="/teacher" className={linkClass} onClick={close}>
                        <FaHome className="text-lg" />
                        <span>Maestros</span>
                      </NavLink>

                      <NavLink to="/user" className={linkClass} onClick={close}>
                        <FaHome className="text-lg" />
                        <span>Usuarios</span>
                      </NavLink>
                      </>
                    )}

                    {isTeacher && (
                      <>
                        <NavLink to="/subjects" className={linkClass} onClick={close}>
                          <MdWorkspacePremium className="text-lg" />
                          <span>Asignaturas</span>
                        </NavLink>

                        <NavLink to="/students" className={linkClass} onClick={close}>
                          <FaUserGraduate className="text-lg" />
                          <span>Estudiantes</span>
                        </NavLink>

                       {/* <NavLink to="/guides" className={linkClass} onClick={close}>
                          <FaBook className="text-lg" />
                          <span>Guías</span>
                        </NavLink> *

                        <NavLink to="/parentPage" className={linkClass} onClick={close}>
                          <FaBook className="text-lg" />
                          <span>Padres</span>
                        </NavLink>
                      </>
                    )}
                     <NavLink to="/guides" className={linkClass} onClick={close}>
                      <FaComments className="text-lg" />
                      <span>Guías</span>
                    </NavLink> 

                    <NavLink to="/quiz" className={linkClass} onClick={close}>
                      <FaGamepad className="text-lg" />
                      <span>Área de juego</span>
                    </NavLink>

                    <NavLink to="/consultation" className={linkClass} onClick={close}>
                      <FaComments className="text-lg" />
                      <span>Foro de Consultas</span>
                    </NavLink>

                    
                  </div>

                  {/* Usuario + logout *
                  <div className="flex items-center gap-3 ml-3">
                    <div className="flex items-center gap-3 bg-white/80 rounded-full px-3 py-1 shadow ring-1 ring-black/5">
                      <FaUser className="text-platform-darkblue" />
                      <div className="text-sm">
                        <div className="text-platform-darkblue font-semibold leading-4 max-w-[200px] truncate">
                          {email ?? "Usuario"}
                        </div>
                        <div className="text-[12px] text-gray-600 leading-4 hidden sm:block">
                          {roles?.join(" • ") || "Sin rol"}
                        </div>
                      </div>
                    </div>

                    <button
                      className="flex items-center gap-2 text-white bg-red-500 hover:bg-red-600
                                 rounded-full px-4 py-2 transition focus:outline-none
                                 focus-visible:ring-2 focus-visible:ring-red-300"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Botón móvil (hasta < lg) *
              {authenticated ? (
                <button
                  type="button"
                  onClick={toggle}
                  aria-controls="mobile-menu"
                  aria-expanded={isMenuOpen}
                  className="custom:hidden text-platform-darkblue hover:text-platform-strawberrypink
                             text-xl p-1 rounded-md focus:outline-none
                             focus-visible:ring-2 focus-visible:ring-platform-strawberrypink"
                  aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                >
                  {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay móvil *
      {authenticated && (
        <div
          className={`lg:hidden fixed inset-0 z-40 bg-black/40 transition-opacity
                     ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Panel móvil *
      {authenticated && (
        <div
          id="mobile-menu"
          className={`lg:hidden fixed top-[100px] left-0 right-0 z-50 mx-4 rounded-2xl
                     bg-platform-softyellow/95 backdrop-blur shadow-2xl ring-1 ring-black/10 overflow-hidden
                     transition-[max-height,opacity,transform]
                     ${isMenuOpen ? "max-h-[80vh] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}
        >
          <div className="p-3">
            {/* Bloque usuario *
            <div className="flex items-center gap-3 bg-white/70 rounded-xl px-3 py-2 mb-2 ring-1 ring-black/5">
              <FaUser className="text-platform-darkblue" />
              <div className="text-sm">
                <div className="text-platform-darkblue font-semibold leading-4">
                  {email ?? "Usuario"}
                </div>
                <div className="text-[12px] text-gray-600 leading-4">
                  {roles?.join(" • ") || "Sin rol"}
                </div>
              </div>
            </div>

            {/* Links *
            <div className="flex flex-col">
              {isTeacher && (
                <NavLink to="/teacher" className={linkClass} onClick={close}>
                  <FaHome className="text-lg" />
                  <span>Inicio</span>
                </NavLink>
              )}
              {isParent && (
                <NavLink to="/parentHome" className={linkClass} onClick={close}>
                  <FaHome className="text-lg" />
                  <span>Inicio</span>
                </NavLink>
              )}

              {isTeacher && (
                <>
                  <NavLink to="/subjects" className={linkClass} onClick={close}>
                    <MdWorkspacePremium className="text-lg" />
                    <span>Asignaturas</span>
                  </NavLink>

                  <NavLink to="/students" className={linkClass} onClick={close}>
                    <FaUserGraduate className="text-lg" />
                    <span>Estudiantes</span>
                  </NavLink>

                  {/*<NavLink to="/guides" className={linkClass} onClick={close}>
                    <FaBook className="text-lg" />
                    <span>Guías</span>
                  </NavLink>*

                  <NavLink to="/parentPage" className={linkClass} onClick={close}>
                    <FaBook className="text-lg" />
                    <span>Padres</span>
                  </NavLink>
                </>
              )}

              <NavLink to="/quiz" className={linkClass} onClick={close}>
                <FaGamepad className="text-lg" />
                <span>Área de juego</span>
              </NavLink>

              <NavLink to="/consultation" className={linkClass} onClick={close}>
                <FaComments className="text-lg" />
                <span>Foro de Consultas</span>
              </NavLink>
            </div>

            {/* Logout *
            <button
              className="mt-3 flex w-full items-center justify-center gap-2 text-white
                         bg-red-500 hover:bg-red-600 rounded-xl px-4 py-2 transition
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};


 */