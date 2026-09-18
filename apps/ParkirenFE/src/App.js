import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import NotFound from "./pages/not-found/404";
import PetugasDashboard from "./pages/petugas/PetugasDashboard";
import { startIdleTimer } from "./utils/idleLogout";
import LandingPage from "./pages/landingPage/LandingPage";

function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to="/404" />;
  }

  return children;
}

function App() {
  useEffect(() => {
    const logout = () => {
      alert("Session habis karena tidak ada aktivitas");
      localStorage.clear();
      window.location.href = "/";
    };

    startIdleTimer(logout);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Owner */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Petugas */}
        <Route
          path="/petugas"
          element={
            <ProtectedRoute allowedRole="petugas">
              <PetugasDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;