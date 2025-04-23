import  React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Spin } from "antd";
import { useAuthContext } from "../../context/AuthContext"; 

const { Content } = Layout;

const Dashboard = () => {
  const { user, isLoggedIn, loading, checkAuth } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user data if not available
  useEffect(() => {
    if (!user && !loading) {
      checkAuth();
    }
  }, [user, loading, checkAuth]);

  // Redirect to correct dashboard based on role or invalid path
  useEffect(() => {
    if (!loading && user) {
      if (!isLoggedIn) {
        navigate("/auth/login");
      } else if (location.pathname === "/dashboard") {
        // Redirect to role-specific default path
        if (user.role === "instructor") {
          navigate("/dashboard/instructor");
        } else if (user.role === "student") {
          navigate("/dashboard/student");
        } else if (user.role === "admin") {
          navigate("/dashboard/admin");
        }
      } else if (
        (user.role === "instructor" && !location.pathname.startsWith("/dashboard/instructor")) ||
        (user.role === "student" && !location.pathname.startsWith("/dashboard/student")) ||
        (user.role === "admin" && !location.pathname.startsWith("/dashboard/admin"))
      ) {
        // Redirect to the correct dashboard if the user accesses a wrong role-based path
        if (user.role === "instructor") {
          navigate("/dashboard/instructor");
        } else if (user.role === "student") {
          navigate("/dashboard/student");
        } else if (user.role === "admin") {
          navigate("/dashboard/admin");
        }
      }
    }
  }, [loading, isLoggedIn, user, location.pathname, navigate]);

   
  
};

export default Dashboard;