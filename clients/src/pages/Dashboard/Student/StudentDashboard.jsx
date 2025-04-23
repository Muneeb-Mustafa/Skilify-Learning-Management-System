import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentHome from "./StudentHome";
import PageNotFound from "../../../components/PageNotFound/PageNotFound";
import Enrollments from "./Enrollments";
import CourseDetail from "./CourseDetail";
import Profile from "./Profile";

const StudentDashboard = () => {
  return (
    <Routes>
      {/* Default student dashboard page */}
      <Route index element={<StudentHome />} />
      <Route path="enrollments" element={<Enrollments />} />
      <Route path="course/:courseId" element={<CourseDetail />} />
      <Route path="profile" element={<Profile />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default StudentDashboard;
