import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Breadcrumb, Spin, Alert, Tabs, Rate, Button, Modal, message } from "antd";
import axios from "axios";
import { useAuthContext } from "../../../context/AuthContext";
import { API_URL } from "../../../config"; 

const { TabPane } = Tabs;

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuthContext();
  const [rating, setRating] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [completedLectures, setCompletedLectures] = useState(new Set());
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);

  useEffect(() => {
    fetchCourseAndEnrollments();
  }, [courseId]);

  const fetchCourseAndEnrollments = async () => {
    try {
      setLoading(true);
      const courseResponse = await axios.get(
        `${API_URL}/api/courses/single-course/${courseId}`,
        { withCredentials: true }
      );
      setCourse(courseResponse.data);

      const enrollmentsResponse = await axios.get(`${API_URL}/api/courses/enrollments`, {
        withCredentials: true,
      });
      const userEnrollment = enrollmentsResponse.data.find(
        (enrollment) => enrollment.courseId.toString() === courseId
      );
      if (userEnrollment?.completedLectures) {
        const completedSet = new Set(userEnrollment.completedLectures.map(lecture => lecture.lectureId.toString()));
        setCompletedLectures(completedSet);

        // Check if all lectures are completed
        const totalLectures = courseResponse.data.chapters.reduce(
          (total, chapter) => total + (chapter.lectures?.length || 0),
          0
        );
        setIsCourseCompleted(completedSet.size === totalLectures);
      }
    } catch (err) {
      setError("Failed to load course or enrollment details.");
      console.error("Error fetching course or enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollNow = () => {
    if (isLoggedIn) {
      navigate(`/enroll-now/${courseId}`);
    } else {
      navigate("/auth/login");
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
    console.log(`Rated ${value} stars for course ${courseId}`);
  };

  const handleMarkComplete = async (lectureId) => {
    try {
      await axios.post(
        `${API_URL}/api/courses/mark-complete/${courseId}`,
        { lectureId },
        { withCredentials: true }
      );
      const newCompletedLectures = new Set(completedLectures);
      newCompletedLectures.add(lectureId.toString());
      setCompletedLectures(newCompletedLectures);
      message.success("Lecture marked as complete!");
      fetchEnrollments();
    } catch (err) {
      setError("Failed to mark lecture as complete.");
      console.error("Error marking lecture as complete:", err);
      message.error("Failed to mark lecture as complete.");
    }
  };

  const handleMarkCourseComplete = async () => {
    try {
      const allLectureIds = course.chapters.flatMap(chapter =>
        chapter.lectures.map(lecture => lecture._id)
      );

      await axios.post(
        `${API_URL}/api/courses/mark-course-complete/${courseId}`,
        { lectureIds: allLectureIds },
        { withCredentials: true }
      );

      setIsCourseCompleted(true);
      setCompletedLectures(new Set(allLectureIds.map(id => id.toString())));
      message.success("Course marked as complete!");
      fetchEnrollments();
    } catch (err) {
      setError("Failed to mark course as complete.");
      console.error("Error marking course as complete:", err);
      message.error("Failed to mark course as complete.");
    }
  };

  const fetchEnrollments = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/courses/enrollments`, {
        withCredentials: true,
      });
      const userEnrollment = data.find(
        (enrollment) => enrollment.courseId.toString() === courseId
      );
      if (userEnrollment?.completedLectures) {
        setCompletedLectures(new Set(userEnrollment.completedLectures.map(lecture => lecture.lectureId.toString())));
      }
    } catch (err) {
      console.error("Error refetching enrollments:", err);
    }
  };

  const showVideoModal = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedVideoUrl("");
  };

  if (error) return <Alert message={error} type="error" showIcon className="m-4" />;

  return (
    <div className="course-detail-container">
      <Breadcrumb
        items={[
          { title: <Link to="/" className="text-decoration-none">Home</Link> },
          { title: <Link to="/dashboard/student/enrollments" className="text-decoration-none">Enrollments</Link> },
          { title: course ? course.title : "Course Details" },
        ]}
        className="course-breadcrumb"
      />

      <Spin spinning={loading} tip="Loading course details...">
        {course && (
          <div className="course-content">
            <div className="row">
              {/* Course Info Section */}
              <div className="col-12 col-lg-8">
                <div className="course-header">
                  <h1 className="course-title">{course.title}</h1>
                  <p className="course-subtitle">{course.subtitle || course.category}</p>
                </div>

                {/* Course Structure Card */}
                <div className="course-structure-card">
                  <h5 className="card-title">Course Structure</h5>
                  {course.chapters?.map((chapter, index) => (
                    <div key={index} className="chapter-container">
                      <select className="chapter-select">
                        <option>{chapter.title || `Chapter ${index + 1}`}</option>
                      </select>
                      <div className="chapter-info">
                        {chapter.lectures?.length || 0} lectures -{" "}
                        {chapter.lectures?.reduce((total, lecture) => total + (lecture.duration || 0), 0) || 0} minutes
                      </div>
                      <ul className="lecture-list">
                        {chapter.lectures?.map((lecture, lectureIndex) => (
                          <li key={lectureIndex} className="lecture-item">
                            <div className="lecture-info">
                              <span
                                onClick={() => showVideoModal(lecture.url)}
                                className="lecture-title"
                              >
                                {lecture.title || `Lecture ${lectureIndex + 1}`} (Duration: {lecture.duration || 0} minutes)
                              </span>
                            </div>
                            <Button
                              type="primary"
                              onClick={() => handleMarkComplete(lecture._id)}
                              disabled={completedLectures.has(lecture._id.toString())}
                              className={completedLectures.has(lecture._id.toString()) ? "btn-completed" : "btn-mark-complete"}
                            >
                              {completedLectures.has(lecture._id.toString()) ? "Completed" : "Mark as Complete"}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Rating Section */}
                <div className="rating-section">
                  <h5 className="section-title">Rate this Course:</h5>
                  <Rate
                    allowHalf
                    value={rating}
                    onChange={handleRatingChange}
                    className="course-rating"
                  />
                </div>

                {/* Course Tabs */}
                <Tabs 
                  defaultActiveKey="1" 
                  className="course-tabs"
                  tabBarGutter={16}
                  size="small"
                >
                  <TabPane tab="Description" key="1">
                    <h5 className="tab-title">About This Course</h5>
                    <p className="tab-content">{course.description}</p>
                  </TabPane>
                  <TabPane tab="Curriculum" key="3">
                    <h5 className="tab-title">Curriculum</h5>
                    <div className="tab-content">
                      {course.chapters?.length > 0
                        ? course.chapters.map((chapter, index) => (
                            <div key={index} className="curriculum-chapter">
                              <strong>{chapter.title || `Chapter ${index + 1}`}</strong>
                              <ul className="curriculum-lectures">
                                {chapter.lectures?.map((lecture, lectureIndex) => (
                                  <li key={lectureIndex} className="curriculum-lecture">
                                    {lecture.title || `Lecture ${lectureIndex + 1}`}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))
                        : "Syllabus not available."}
                    </div>
                  </TabPane>
                  <TabPane tab="Outcomes" key="4">
                    <h5 className="tab-title">Outcomes</h5>
                    <p className="tab-content">
                      {course.outcomes || "No specific outcomes listed."}
                    </p>
                  </TabPane>
                  <TabPane tab="Reviews" key="6">
                    <h5 className="tab-title">Rating & Reviews</h5>
                    <p className="tab-content">
                      {course.testimonials || "No ratings or reviews available."}
                    </p>
                  </TabPane>
                  <TabPane tab="FAQ" key="7">
                    <h5 className="tab-title">FAQ</h5>
                    <p className="tab-content">{course.faq || "No FAQ available."}</p>
                  </TabPane>
                </Tabs>
              </div>

              {/* Course Info Card */}
              <div className="col-12 col-lg-4">
                <div className="course-info-card">
                  <img
                    src={course.thumbnail || "https://via.placeholder.com/300"}
                    alt={course.title}
                    className="course-thumbnail"
                  />
                  <div className="card-body">
                    <h3 className="card-course-title">{course.title}</h3>
                    <h2 className="card-price">${course.price}</h2>
                    <p className="card-details">
                      {course.duration || "49 hours, 30 minutes"} |{" "}
                      {course.chapters?.reduce((total, chapter) => total + (chapter.lectures?.length || 0), 0) || 4}{" "}
                      lessons
                    </p>
                    <Button
                      type="primary"
                      onClick={handleMarkCourseComplete}
                      disabled={isCourseCompleted}
                      className={isCourseCompleted ? "btn-course-completed" : "btn-mark-course-complete"}
                    >
                      {isCourseCompleted ? "Course Completed" : "Mark Course as Complete"}
                    </Button>
                    <p className="card-section-title">
                      What's in the course?
                    </p>
                    <ul className="card-features">
                      <li>Lifetime access with free updates.</li>
                      <li>Step-by-step, hands-on project guidance.</li>
                      <li>Downloadable resources and source code.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Spin>

      <Modal
        title="Lecture Video"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        className="video-modal"
        centered
      >
        {selectedVideoUrl && (
          <video
            controls
            controlsList="nodownload"
            src={selectedVideoUrl}
            className="modal-video"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </Modal>
    </div>
  );
};

export default CourseDetail;