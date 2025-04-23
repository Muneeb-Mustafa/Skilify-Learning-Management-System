import React from 'react';

const Section4 = () => {
  return (
    <>
      <div className="container section4">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 text-left d-flex flex-column justify-content-center mb-4 mb-md-0">
            <p className="section-subtitle">About Us</p>
            <h1 className="fw-bold">
              Skilify: A Free E-Learning Service to Help You Grow
            </h1>
            <p className="section-description">
              Skilify is expected to become a beneficial service in the future
              in the field of education.
            </p>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-end">
            <img 
              src="/Images/Home/section4.png" 
              alt="Section4" 
              className="img-fluid section-image"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Section4;