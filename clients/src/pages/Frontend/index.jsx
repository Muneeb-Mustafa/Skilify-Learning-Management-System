import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageNotFound from '../../components/PageNotFound/PageNotFound';
import Home from './Home';  
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer'; 
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import Courses from './Courses';
import DetailCourses from './DetailCourses';
import EnrollCourse from './EnrollCourse';

const Frontend = () => {
  return (
    <>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/courses" element={<Courses/>} />   
        <Route path="/course/:courseId" element={<DetailCourses />} /> 
        <Route path="/privacy" element={<PrivacyPolicy />} /> 
        <Route path="/terms-of-service" element={<TermsOfService />} /> 
        <Route path="/privacy-policy" element={<PrivacyPolicy />} /> 
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer/>
    </>
  );
};

export default Frontend;