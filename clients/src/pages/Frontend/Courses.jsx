import React, { useEffect, useState } from "react";
import { Breadcrumb, Input, Pagination, Spin } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import { Card, Row, Col } from "react-bootstrap";
import { FaRegClock } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import { GoPeople } from "react-icons/go"; 

const { Search } = Input;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const coursesPerPage = 9;
  const MAX_PREVIEW_LENGTH = 100;

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/courses/get-course`, { withCredentials: true });
      const courseData = Array.isArray(data) ? data : [];
      setCourses(courseData);
      setFilteredCourses(courseData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(value.toLowerCase()) ||
      course.description.toLowerCase().includes(value.toLowerCase()) ||
      course.category.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    const truncated = text.substr(0, maxLength);
    return truncated.substr(0, truncated.lastIndexOf(" ")) + "...";
  };

  const toggleDescription = (courseId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <>
      <div className="breadcrumb">
        <Breadcrumb 
          className="container pt-4 pb-4"
          items={[
            { title: <Link to="/" className="text-decoration-none text-black">Home</Link> },
            { title: <Link to="/courses" className="text-decoration-none text-black">Courses</Link> }
          ]}
        />
      </div>

      <div className="searchContainer w-50 mx-auto pt-4 pb-4">
        <Search
          placeholder="Search for courses by title, description, or category"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          enterButton
          size="large"
          allowClear
        />
      </div>

      <div className="container courses-container">
        {loading ? (
          <div className="loading-container">
            <Spin 
              size="large"
              tip="Loading Courses..."
            />
          </div>
        ) : (
          <>
            {filteredCourses.length === 0 && searchTerm && (
              <p className="text-center no-results">No courses found matching "{searchTerm}"</p>
            )}
            <Row>
              {currentCourses.map((course) => {
                const isExpanded = expandedDescriptions[course._id];
                const previewText = truncateText(course.description, MAX_PREVIEW_LENGTH);
                const needsReadMore = course.description.length > MAX_PREVIEW_LENGTH;

                return (
                  <Col lg={4} md={6} sm={12} key={course._id} className="mb-4">
                    <Card className="h-100 shadow-sm course-card">
                      <div className="card-image-wrapper">
                        <Link to={`/course/${course._id}`}>
                          <Card.Img variant="top" src={course.thumbnail} alt={course.title} />
                        </Link>
                        <span className="price-badge">${course.price}</span>
                      </div>
                      <Card.Body>
                        <h5>{course.title}</h5>
                        <p className="course-description">
                          {isExpanded ? course.description : previewText}
                          {needsReadMore && (
                            <button
                              onClick={() => toggleDescription(course._id)}
                              className="read-more-btn"
                            >
                              {isExpanded ? "Read Less" : "Read More"}
                            </button>
                          )}
                        </p>
                        <p className="instructor">
                          <strong>Instructor:</strong> {course.instructor?.name || "Unknown"}
                        </p>
                        <div className="course-stats">
                          <span>
                            <FaRegClock className="stat-icon" />
                            {course.level}
                          </span>
                          <span>
                            <FaPlayCircle className="stat-icon" />
                            {course.chapters.reduce((acc, chap) => acc + chap.lectures.length, 0)} Videos
                          </span>
                          <span>
                            <GoPeople className="stat-icon" />
                            {Math.floor(Math.random() * 2000) + 500} Students
                          </span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {filteredCourses.length > 0 && (
              <div className="pagination-wrapper">
                <Pagination
                  className="custom-pagination"
                  current={currentPage}
                  pageSize={coursesPerPage}
                  total={filteredCourses.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Courses;