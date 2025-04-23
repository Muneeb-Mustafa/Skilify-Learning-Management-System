import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Breadcrumb, Spin, Alert, Tabs } from "antd";
import axios from "axios";
import { API_URL } from "../../config";
import { useAuthContext } from "../../context/AuthContext";

const { TabPane } = Tabs;

const DetailCourses = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuthContext();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/api/courses/single-course/${courseId}`, { withCredentials: true });
        setCourse(data); 
      } catch (err) {
        setError("Failed to load course details.");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEnrollNow = () => {
    if (isLoggedIn) {
      navigate(`/enroll-now/${courseId}`);
    } else {
      navigate(`/auth/login`);
    }
  };

  if (error) return <Alert message={error} type="error" showIcon className="m-4" />;

  return (
    <div className="container mt-4 mb-4 px-3 px-sm-4">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { title: <Link to="/" className="text-decoration-none">Home</Link> },
          { title: <Link to="/courses" className="text-decoration-none">Courses</Link> },
          { title: course ? course.title : "Course Details" },
        ]}
        className="mb-4"
      />

      {/* Wrap Content in Spin */}
      <Spin spinning={loading} tip="Loading course details...">
        {course && (
          <div className="row">
            {/* Card Section for Mobile (hidden on desktop) */}
            <div className="col-12 d-block d-lg-none mb-4">
              <div className="card shadow">
                <div>
                  <img
                    src={course.thumbnail || "https://via.placeholder.com/150"}
                    alt={course.title}
                    className="img-fluid w-100 shadow-sm"
                  />
                </div>
                <div className="p-3">
                  <h3 className="fw-bold fs-4">{course.title}</h3>
                  <p className="text-warning fw-bold">⏱️5 days left at this price!</p>
                  <h2 className="text-black fw-bold">${course.price}</h2>
                  <p className="text-muted">49 hours, 30 minutes | 4 lessons</p>
                  <button
                    className="btn btn-primary w-100 mt-3 fw-bold py-2"
                    onClick={handleEnrollNow}
                    style={{ backgroundColor: "#1C1E53", color: "#fff" }}
                  >
                    Enroll Now
                  </button>
                  <p className="mt-3">What's in the course?</p>
                  <ul className="list-unstyled text-muted">
                    <li className="mb-2">✓ Lifetime access with free updates.</li>
                    <li className="mb-2">✓ Step-by-step, hands-on project guidance.</li>
                    <li className="mb-2">✓ Downloadable resources and source code.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Left Section: Course Details */}
            <div className="col-12 col-lg-8">
              <h3 className="fw-bold">{course.title}</h3>
              <p className="text-muted">{course.category}</p>

              {/* Chapters and Lectures Section */}
              <div className="mt-3">
                <h5>Chapters</h5>
                <ul className="list-group mb-4">
                  {course.chapters?.map((chapter, index) => (
                    <li key={index} className="list-group-item">
                      {chapter.title || `Chapter ${index + 1}`}
                      <ul className="list-group mt-2">
                        {chapter.lectures?.map((lecture, lectureIndex) => (
                          <li key={lectureIndex} className="list-group-item ps-4">
                            {lecture.title || `Lecture ${lectureIndex + 1}`}
                          </li>
                        )) || <li className="list-group-item ps-4">No lectures available.</li>}
                      </ul>
                    </li>
                  )) || <p>No chapters available.</p>}
                </ul>
              </div>

              {/* Tabs Section */}
              <div className="mt-4">
                <Tabs defaultActiveKey="1" className="course-tabs">
                  <TabPane tab="Description" key="1">
                    <h5>About This Course</h5>
                    <p>{course.description}</p>
                  </TabPane>
                  <TabPane tab="Curriculum" key="3">
                    <h5>Curriculum</h5>
                    <p>{course.curriculum || "Syllabus not available."}</p>
                  </TabPane>
                  <TabPane tab="Outcomes" key="4">
                    <h5>Outcomes</h5>
                    <p>{course.outcomes || "No specific prerequisites required."}</p>
                  </TabPane>
                  <TabPane tab="Rating & Reviews" key="6">
                    <h5>Rating</h5>
                    <p>{course.testimonials || "No rating available."}</p>
                  </TabPane>
                  <TabPane tab="FAQ" key="7">
                    <h5>FAQ</h5>
                    <p>{course.faq || "No FAQ available."}</p>
                  </TabPane>
                </Tabs>
              </div>
            </div>

            {/* Right Section: Enrollment Details (visible only on desktop) */}
            <div className="col-lg-4 d-none d-lg-block">
              <div className="card shadow sticky-lg-top" style={{ top: "20px" }}>
                <div>
                  <img
                    src={course.thumbnail || "https://via.placeholder.com/150"}
                    alt={course.title}
                    className="img-fluid w-100 shadow-sm"
                  />
                </div>
                <div className="p-3">
                  <h3 className="fw-bold fs-4">{course.title}</h3>
                  <p className="text-warning fw-bold">⏱️5 days left at this price!</p>
                  <h2 className="text-black fw-bold">${course.price}</h2>
                  <p className="text-muted">49 hours, 30 minutes | 4 lessons</p>
                  <button
                    className="btn btn-primary w-100 mt-3 fw-bold py-2"
                    onClick={handleEnrollNow}
                    style={{ backgroundColor: "#1C1E53", color: "#fff" }}
                  >
                    Enroll Now
                  </button>
                  <p className="mt-3">What's in the course?</p>
                  <ul className="list-unstyled text-muted">
                    <li className="mb-2">✓ Lifetime access with free updates.</li>
                    <li className="mb-2">✓ Step-by-step, hands-on project guidance.</li>
                    <li className="mb-2">✓ Downloadable resources and source code.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default DetailCourses;