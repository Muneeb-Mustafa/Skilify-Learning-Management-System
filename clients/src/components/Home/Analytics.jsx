import React from 'react';

const Analytics = () => {
  return (
    <div className="container-fluid analytics1 py-4">
      <div className="row align-items-center">
        <div className="col-12 col-lg-6">
          <div className="row justify-content-center justify-content-lg-start">
            <div className="col-4 col-md-4 text-center">
              <h4 className="fw-bold">21,000+</h4>
              <p className="mb-4">Registered Students</p>
            </div>
            <div className="col-4 col-md-4 text-center">
              <h4 className="fw-bold">100+</h4>
              <p className="mb-4">Expert Instructors</p>
            </div>
            <div className="col-4 col-md-4 text-center">
              <h4 className="fw-bold">150+</h4>
              <p>Free Courses</p>
            </div>
          </div>
        </div>

        <div className="analytics col-12 col-lg-6 d-flex justify-content-center align-items-center flex-wrap mt-4 mt-lg-0">
          <img
            src="/Images/Home/lorem.png"
            alt="Lorem"
            className="img-fluid logo-img"
          />
          <img
            src="/Images/Home/ditlance.png"
            alt="Ditlance"
            className="img-fluid logo-img"
          />
          <img
            src="/Images/Home/owthest.png"
            alt="Owthest"
            className="img-fluid logo-img"
          />
          <img
            src="/Images/Home/neovasi.png"
            alt="Neovasi"
            className="img-fluid logo-img"
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;