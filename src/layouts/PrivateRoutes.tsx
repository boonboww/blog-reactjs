import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes: React.FC = () => {
  const token: string | null = localStorage.getItem("access_token");

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
