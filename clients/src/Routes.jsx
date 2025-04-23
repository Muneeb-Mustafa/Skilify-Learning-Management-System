import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Frontend from "./pages/Frontend";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./pages/PrivateRoute";
import { useAuthContext } from "./context/AuthContext";

const Index = () => {
  const { isLoggedIn, loading } = useAuthContext(); 
  if (loading) {
    return null; 
  }

  return (
    <>
    <Routes>
      <Route path="/*" element={<Frontend />} /> 
      <Route path="/auth/*" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Auth />} /> 
      <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>
    </>
  );
};

export default Index;