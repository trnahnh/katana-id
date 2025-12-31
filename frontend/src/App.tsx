import { Route, Routes, Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import { Toaster } from "sonner";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/Dashboard";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import GridBackground from "./components/GridBackground";

const PublicLayout = () => (
  <>
    {/* Grid Background with cursor effect */}
    <GridBackground
      glowColor="#a855f7"
      glowRadius={180}
      glowIntensity={0.3}
      gridSize={32}
    />
    <NavBar />
    <Outlet />
  </>
);

const DashboardLayout = () => <Outlet />;

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
