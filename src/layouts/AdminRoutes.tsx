import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes: React.FC = () => {
  const loggedIn = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("user_role");

  // Not logged in - redirect to login
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin - redirect to home
  if (userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin - allow access
  return <Outlet />;
};

export default AdminRoutes;
