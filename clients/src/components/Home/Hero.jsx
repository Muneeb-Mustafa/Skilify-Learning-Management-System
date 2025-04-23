import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="container-fluid hero-home d-flex align-items-center justify-content-between pt-5 pb-5">
      <div className="col-12 col-lg-6 text-left px-4 px-lg-5">
        <h1>Build and Achieve Your Dreams with Skilify</h1>
        <p>
          Skilify is a free online course and training service designed to help you achieve your goals in the field of technology.
        </p>
        <div className="d-flex gap-3 flex-column flex-lg-row">
          <Link to="/courses">
            <button
              className="btn btn-danger"
              style={{ color: "#000", backgroundColor: '#FCD980', padding: "12px 25px" }}
            >
              View Courses
            </button>
          </Link>
          <Link to="/courses" className="btn btn-link text-light text-decoration-none pt-3 pt-lg-0">
            View Learning Paths →
          </Link>
        </div>
      </div>
      <div className="col-12 col-lg-6 d-flex justify-content-center">
        <img src="/Images/Home/hero.png" alt="Home" className="img-fluid" />
      </div>
    </div>
  );
};

export default Hero;