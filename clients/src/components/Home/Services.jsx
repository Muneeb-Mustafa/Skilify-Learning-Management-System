import React from 'react';

const Services = () => {
  return (
    <>
      <div className="services pt-5 pb-5">
        <h2 style={{ textAlign: "center" }}>
          Benefits of Joining Skilify <br/> E-Learning
        </h2>
      </div>
      <div className="container service-cards">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <div className="col">
            <div className="cards p-5 text-left">
                <img src="/Images/Home/n1.png" alt="Icon1" className="img-fluid pb-4" />
              <h3>Free Courses</h3>
              <p>
                We offer free courses to support accessible education for the community, empowering everyone to learn.
              </p>
            </div>
          </div>
          <div className="col">
            <div className="cards p-5">
                <img src="/Images/Home/n2.png" alt="Icon2" className="img-fluid pb-4" />
              <h3>Lifetime Access</h3>
              <p>
                All courses you register for can be accessed forever, so you can learn at your own pace without feeling rushed.
              </p>
            </div>
          </div>
          <div className="col">
            <div className="cards p-5">
                <img src="/Images/Home/n3.png" alt="Icon3" className="img-fluid pb-4" />
              <h3>Consultation Groups</h3>
              <p>
                Join consultation groups where you can ask questions and participate in discussions on various topics.
              </p>
            </div>
          </div>
          <div className="col">
            <div className="cards p-5">
                <img src="/Images/Home/n4.png" alt="Icon4" className="img-fluid pb-4" />
              <h3>Certificates</h3>
              <p >
                Upon completing a course, you will receive a certificate and a portfolio from the projects you have completed.
              </p>
            </div>
          </div>
          <div className="col">
            <div className="cards p-5">
                <img src="/Images/Home/n5.png" alt="Icon5" className="img-fluid pb-4" />
              <h3>Structured Learning</h3>
              <p>
                Our courses are designed for all levels, from beginners to experts, ensuring everyone can benefit from our platform.
              </p>
            </div>
          </div>
          <div className="col">
            <div className="cards p-5">
                <img src="/Images/Home/n6.png" alt="Icon6" className="img-fluid pb-4" />
              <h3>Experienced Instructors</h3>
              <p>
                Our experienced instructors come from various industries, bringing valuable expertise to the learning experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
