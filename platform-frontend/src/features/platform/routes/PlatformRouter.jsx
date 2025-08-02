import { Navbar, Footer } from '../components';
import { Navigate, Routes, Route, Outlet } from 'react-router-dom';
import { HomePage, PlatformPage, ForumPage } from '../pages';
import QuizPage from '../pages/QuizPage';
import GradesPage from '../pages/GradesPage';
import LoginPage from '../pages/security/auth/LoginPage';

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
      <Routes>
        {/* Rutas públicas: login sin navbar ni footer */}
        <Route path="/auth/login" element={<LoginPage />} />

        {/* Rutas privadas: todo lo demás con layout */}
        <Route element={<Layout />}>
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/platform" element={<PlatformPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/consultation" element={<ForumPage />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Route>
      </Routes>
    </div>
  );
};
