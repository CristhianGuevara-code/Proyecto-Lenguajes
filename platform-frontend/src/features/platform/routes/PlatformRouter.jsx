import { PrivateRoute } from "../components/shared";
import { RoleProtectedRoute } from "../components/shared";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "../pages/security/auth/LoginPage";
import { Role } from "../../../infraestructure/enums/role.enum";
import { TeacherPage, SubjectPage, StudentPage,
    PlatformPage, QuizPage, ForumPage, TeacherHome, UserPage, 
    } from "../pages";
import { Navbar, Footer } from "../components";
import ParentPage from "../pages/ParentPage";
import GuidePage from "../pages/Guides";
import GuidesPage from "../pages/GuidesPage";
import AdminHome from "../pages/AdminHome";
import ParentHome from "../pages/ParentHome";

 const Layout = () => (
  <>
    <Navbar />
    <div className="px-16 py-8">
      <div className="container flex justify-between mx-auto">
        <Outlet />
      </div>
    </div>
    <Footer />
  </>
); 

export const PlatformRouter = () => {
  return (
    <div className="overflow-x-hidden bg-gray-100 w-screen h-screen bg-hero-pattern bg-no-repeat bg-cover">
      <Routes>
        {/* público */}
        <Route path="/" element={<Navigate to="/auth/login" />} />
        <Route path="/auth/login" element={<LoginPage />} />

        {/* privado (auth requerido) */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            {/* Rutas de PROFESOR */}
            <Route element={<RoleProtectedRoute requiredRoles={[Role.PROFESOR]} />}>
              <Route path="/teacherHome" element={<TeacherHome />} />
              <Route path="/subjects" element={<SubjectPage />} />
              <Route path="/students" element={<StudentPage />} />
              {/*<Route path="/guides" element={<GuidePage />} /> */}
              <Route path="/parentPage" element={<ParentPage />} />
              {/* Si grades es solo lectura para maestro, también acá */}
              {/* <Route path="/grades" element={<GradesPage />} /> */}
            </Route>

            {/* Rutas de ADMIN */}
            <Route element={<RoleProtectedRoute requiredRoles={[Role.ADMIN]} />}>
            <Route path="/adminHome" element={<AdminHome />} />
            <Route path="/teacher" element={<TeacherPage />} />
            <Route path="/user" element={<UserPage />} />
            </Route>

            {/* Rutas de PADRE */}
            <Route element={<RoleProtectedRoute requiredRoles={[Role.PADRE]} />}>
              <Route path="/parentHome" element={<ParentHome />} />
              
              {/* /my-subjects, /my-guides, etc. cuando los tengas */}
            </Route>

            {/* Rutas comunes (ambos roles) */}
            <Route path="/platform" element={<PlatformPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/consultation" element={<ForumPage />} />
            <Route path="/guides" element={<GuidesPage />} />
 
            {/* catch-all privado */}
            <Route path="*" element={<Navigate to="/platform" />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};


/*import { Navbar, Footer } from '../components';
import { Navigate, Routes, Route, Outlet } from 'react-router-dom';
import { PlatformPage, ForumPage } from '../pages';
import AssignmentsPage from '../pages/AssignmentsPage';
import LoginPage from '../pages/security/auth/LoginPage';
import ParentPage from '../pages/ParentHome';
import GuidesPage from '../pages/GuidesPage';
import TeacherPage from '../pages/TeacherHome';
import QuizPage from '../pages/QuizPage';
import { SubjectPage } from '../pages';
import StudentPage from '../pages/StudentPage'

// Layout que incluye Navbar y Footer
 const Layout = () => (
  <>
    <Navbar />
    <div className="px-16 py-8">
      <div className="container flex justify-between mx-auto">
        <Outlet />
      </div>
    </div>
    <Footer />
  </>
); 

export const PlatformRouter = () => {
  return (
    <div className="overflow-x-hidden bg-gray-100 w-screen h-screen bg-hero-pattern bg-no-repeat bg-cover">
  */
 
    {/** 
      <Routes>
        {/* Redirigir / al login 
        <Route path="/" element={<Navigate to="/auth/login" />} />

        {/* Ruta pública: login sin layout 
        <Route path="/auth/login" element={<LoginPage />} />

        {/* Rutas privadas: con navbar y footer 
        <Route element={<Layout />}>
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/parentHome" element={<ParentPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/subjects" element={<SubjectPage />} />
          <Route path="/platform" element={<PlatformPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/consultation" element={<ForumPage />} />
          <Route path="/students" element={<StudentPage />} />
          {/* Redirección si no se encuentra ninguna ruta 
          <Route path="*" element={<Navigate to="/teacher" />} />
        </Route>
      </Routes> 

   
    </div>
  );
};
*/}
