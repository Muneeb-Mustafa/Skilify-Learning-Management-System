
import React, { useState, useEffect } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Spin, Alert, Input, Select, Button, Progress, Row, Col, Statistic } from 'antd';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { API_URL } from '../../../config';  

const { Option } = Select;

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const StudentHome = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Category');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/courses/enrollments`, { withCredentials: true });
      
      // Filter out duplicate courseIds
      const uniqueEnrollments = Array.from(
        new Map(data.map(item => [item.courseId._id, item])).values()
      );
      
      setEnrolledCourses(uniqueEnrollments);
    } catch (err) {
      setError('Failed to load enrolled courses.');
      console.error('Error fetching enrolled courses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate student-specific stats
  const completedCourses = enrolledCourses.filter(course => 
    course.completedLectures?.length === course.courseId?.chapters?.reduce((total, chapter) => 
      total + (chapter.lectures?.length || 0), 0)
  ).length;

  const inProgressCourses = enrolledCourses.filter(course => 
    course.completedLectures?.length > 0 && 
    course.completedLectures?.length < course.courseId?.chapters?.reduce((total, chapter) => 
      total + (chapter.lectures?.length || 0), 0)
  ).length;

  const totalLearningHours = enrolledCourses.reduce((total, enrollment) => {
    const courseDuration = enrollment.courseId?.chapters?.reduce((sum, chapter) => 
      sum + (chapter.lectures?.reduce((lecSum, lecture) => lecSum + (lecture.duration || 0), 0) || 0), 0) || 0;
    return total + (courseDuration / 3600); // Assuming duration is in seconds, convert to hours
  }, 0);

  const progressData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Learning Progress (%)',
        data: [10, 25, 40, 60, 80, 95],
        borderColor: '#007bff', // Blue for progress
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const coursesData = {
    labels: enrolledCourses.map(enrollment => enrollment.courseId?.title || 'Unknown'),
    datasets: [
      {
        label: 'Progress (%)',
        data: enrolledCourses.map(enrollment => {
          const totalLectures = enrollment.courseId?.chapters?.reduce((total, chapter) => 
            total + (chapter.lectures?.length || 0), 0) || 1;
          return ((enrollment.completedLectures?.length || 0) / totalLectures) * 100;
        }),
        backgroundColor: '#6f42c1', // Purple for bar chart
        borderColor: '#6f42c1',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '' },
    },
    scales: { y: { beginAtZero: true } },
  };

  const filteredCourses = enrolledCourses.filter(course => 
    course.courseId?.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category === 'Category' || course.courseId?.title.includes(category))
  );

  if (error) return <Alert message={error} type="error" showIcon className="m-4" />;

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
      <Spin spinning tip="Loading enrolled courses..." />
    </div>
  );

  return (
    <div className="student-home">
      <div className="dashboard-container">
        {/* Stats Section */}
        <Row gutter={16} className="stats-section">
          <Col span={8}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Completed Courses"
                value={completedCourses}
                valueStyle={{ color: '#28a745' }} 
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="In-Progress Courses"
                value={inProgressCourses}
                valueStyle={{ color: '#dc3545' }} 
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Enrolled Courses"
                value={enrolledCourses.length}
                valueStyle={{ color: '#007bff' }} 
              />
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
        <Row gutter={16} className="charts-section">
          <Col span={12}>
            <Card bordered={false} className="chart-card">
              <h3>Learning Progress</h3>
              <p>Progress Over Time</p>
              <Line data={progressData} options={chartOptions} />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} className="chart-card">
              <h3>Course Progress</h3>
              <p>Progress by Course</p>
              <Bar data={coursesData} options={chartOptions} />
            </Card>
          </Col>
        </Row>

        {/* Learning Activity Section */}
        <div className="learning-activity">
          <div className="header">
            <h2 className="section-title">Learning Activity</h2>
            <div className="filters">
              <Input.Search
                placeholder="Search courses"
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 200, marginRight: 16 }}
              />
              <Select value={category} onChange={setCategory} style={{ width: 150 }}>
                <Option value="Category">Category</Option>
                <Option value="Programming">Programming</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="Data Science">Data Science</Option>
                <Option value="Design">Design</Option>
              </Select>
            </div>
          </div>

          <div className="course-list">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(enrollment => {
                const course = enrollment.courseId;
                const courseTitle = course?.title || 'Unknown Course';
                const courseImage = course?.thumbnail || 'https://via.placeholder.com/60';
                const progress = ((enrollment.completedLectures?.length || 0) / 
                  (course?.chapters?.reduce((total, chapter) => total + (chapter.lectures?.length || 0), 0) || 1)) * 100 || 0;

                return (
                  <Card key={enrollment._id} className="course-item " style={{paddingRight: "0px"}} hoverable>
                    <div className="course-content">
                      <img src={courseImage} alt={courseTitle} className="course-image" />
                      <div className="course-details">
                        <h4 className="course-title">{courseTitle}</h4>
                        <p className="course-description">{course?.description || 'No description available'}</p>
                        <div className="progress-container">
                          <Progress percent={progress.toFixed(2)} size="small" />
                          <span className="progress-text">{Math.round(progress)}%</span>
                        </div>
                      </div>
                      <Button
                        type="primary"
                        className={`action-button ${progress === 100 ? 'certificate' : ''}`}
                        // onClick={() => window.location.href = `/dashboard/student/course/${course._id}`}
                        onClick={() => navigate(`/dashboard/student/course/${course._id}`)}
                      >
                        {progress === 100 ? 'Completed' : 'Continue'}
                      </Button>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="no-courses">
                <p>No enrolled courses found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Back to Homepage Link */}
        <Link to="/" className="back-link">
          <FaArrowLeftLong /> Back To Homepage
        </Link>
      </div>
    </div>
  );
};

export default StudentHome;