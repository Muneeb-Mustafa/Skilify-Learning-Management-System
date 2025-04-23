import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { Card, Row, Col } from "react-bootstrap";
import { FaRegClock } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import axios from "axios";
import { API_URL } from "../../config"; 

const RecommendedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/courses/get-course`, {
        withCredentials: true,
      });
      const courseData = Array.isArray(data) ? data : [];
      const limitedCourses = courseData.slice(0, 3);
      setCourses(limitedCourses); 
    } catch (error) {
      console.error("Error fetching recommended courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="container" style={{ padding: "20px 0px" }}>
      <div className="row header-section">
        <div className="col-6 text-left fw-bold">
          <h1 className="fw-bold">
            Recommended Courses <br />
            For You
          </h1>
        </div>
        <div className="buttons col-6 text-end">
          <Link
            to="#"
            className="btn btn-link text-black text-decoration-none view-learning-path"
            style={{ paddingRight: "50px" }}
          >
            View Learning Path <FaChevronDown className="fw-light text-black" />
          </Link>
          <Link to="/courses">
            <button
              className="btn border-none text-black view-courses-btn"
              style={{ backgroundColor: "#FCD980", padding: "12px 25px" }}
            >
              View Courses
            </button>
          </Link>
        </div>
      </div>
      <hr />
      <Row style={{ paddingTop: "50px" }}>
        {loading ? (
          <Col className="text-center">
            <p>Loading recommended courses...</p>
          </Col>
        ) : courses.length === 0 ? (
          <Col className="text-center">
            <p>No recommended courses available.</p>
          </Col>
        ) : (
          courses.map((course) => (
            <Col lg={4} md={6} sm={12} key={course._id} className="mb-4" style={{paddingLeft: "20px", paddingRight: "20px" }}>
              <Card className="h-100 shadow-sm position-relative">
                <div className="position-relative">
                  <Link to={`/course/${course._id}`}>
                    <Card.Img variant="top" src={course.thumbnail} alt={course.title} />
                  </Link>
                  <span
                    className="badge bg-secondary position-absolute"
                    style={{
                      top: "10px",
                      right: "10px",
                      fontSize: "14px",
                      padding: "5px 10px",
                    }}
                  >
                    {course.rating || "4.9"} ⭐
                  </span>
                </div>
                <Card.Body>
                  <h5>{course.title}</h5>
                  <p className="text-muted">{course.description.slice(0, 100)}</p>
                  <div className="d-flex justify-content-between text-muted mb-2 text-black">
                    <span>
                      <FaRegClock style={{ paddingRight: "5px", fontSize: "20px" }} />
                      {course.level || "N/A"}
                    </span>
                    <span>
                      <FaPlayCircle style={{ paddingRight: "5px", fontSize: "20px" }} />
                      {course.chapters?.reduce((acc, chap) => acc + chap.lectures.length, 0) || 0}{" "}
                      Videos
                    </span>
                    <span>
                      <GoPeople style={{ paddingRight: "5px", fontSize: "20px" }} />
                      {Math.floor(Math.random() * 2000) + 500} Students
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default RecommendedCourses;