import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import DashboardHome from "./DashboardHome";
import Courses from "./Courses";
import Addcourses from "./Addcourses";
import Students from "./Students";
import Settings from "./Settings";
import Profile from "./Profile";
import PageNotFound from "../../../components/PageNotFound/PageNotFound";

const InstructorDashboard = () => {
  return (
    <> 
      <Outlet />
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="courses" element={<Courses />} />
        <Route path="addcourses" element={<Addcourses />} />
        <Route path="students" element={<Students />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default InstructorDashboard;
