import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/NavBar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/DashBoard";
// import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { Room } from "./pages/Room";
import { Toaster } from "react-hot-toast";
import { Loader } from "./components/Loader";
import { useState } from "react";
import { useAuth } from "./contexts/AuthContext";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [isDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          isDarkMode
            ? "bg-gradient-to-r from-gray-900 to-black"
            : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        }`}
      >
        <Loader />
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function LogInPageAccess() {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) return <Loader />;
  
  return isLoggedIn ? <Navigate to="/dashboard/home" replace /> : <SignIn />;
}

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LogInPageAccess />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Navigate to="/dashboard/home" replace />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room/:roomId"
            element={
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            }
          />

          {/* Handle Unknown Routes */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard/home" : "/login"} replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
