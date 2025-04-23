import React from "react";
import { Routes, Route, Outlet } from "react-router-dom"; 
import PageNotFound from "../../../components/PageNotFound/PageNotFound"; 
import Users from "./Users";
import Courses from "./Courses";
import Profile from "./Profile";

const AdminDashboard = () => {
  return (
    <> 
      <Outlet />
      <Routes> 
        <Route path="users" element={<Users />} /> 
        <Route path="courses" element={<Courses />} />  
        <Route path="profile" element={<Profile />} />  
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default AdminDashboard;
