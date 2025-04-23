import React from 'react';
import Hero from '../../components/Home/Hero';
import Analytics from '../../components/Home/Analytics';
import Services from '../../components/Home/Services';
import Section4 from '../../components/Home/Section4';
import RecommendedCourses from '../../components/Home/RecommendedCourses';
import Testimonial from '../../components/Home/Testimonial';
import Faq from '../../components/Home/Faq';
import MyForm from '../../components/Home/MyForm';
import Blog from '../../components/Home/Blog';

const Home = () => {
  return (
    <div className='mb-5'> 
      <Hero/>
      <Analytics/>
      <Services/>
      <Section4/>
      <RecommendedCourses/>
      <Testimonial/>
      <Faq/>
      <MyForm/>
      <Blog/>
    </div>
  );
};

export default Home;