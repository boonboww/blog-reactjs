import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserRoutes: React.FC = () => {
  const loggedIn = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("user_role");

  // Not logged in - redirect to login
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but is admin - redirect to admin panel
  if (userRole === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Regular user - allow access
  return <Outlet />;
};

export default UserRoutes;
