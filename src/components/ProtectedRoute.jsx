import { Navigate } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("adminToken");

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
