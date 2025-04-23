import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuthContext();

  if (loading) return <div>Loading...</div>;  

  return isLoggedIn ? children : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;