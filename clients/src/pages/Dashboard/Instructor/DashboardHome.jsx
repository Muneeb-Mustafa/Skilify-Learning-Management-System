import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button, Table, Statistic, Spin, Pagination } from "antd";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../../../config";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDashContext } from "../../../context/DashboardContext";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const DashboardHome = () => {
  const [stats, setStats] = useState({ totalEarnings: 0, totalStudents: 0, totalCourses: 0 });
  const [earningsData, setEarningsData] = useState({ labels: [], datasets: [] });
  const [enrollmentData, setEnrollmentData] = useState({ labels: [], datasets: [] });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enrolledstd, setEnrolledstd } = useDashContext();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Chart options for better mobile responsiveness
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value, index, values) {
            const label = this.getLabelForValue(value);
            // Truncate labels longer than 15 characters
            return label.length > 15 ? label.substring(0, 15) + "..." : label;
          },
          maxRotation: 45, // Rotate labels to 45 degrees by default
          minRotation: 45,
          autoSkip: false, // Ensure all labels are shown
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    // Adjust rotation for mobile devices
    responsive: true,
    onResize: (chart, size) => {
      if (size.width < 768) {
        chart.options.scales.x.ticks.maxRotation = 90;
        chart.options.scales.x.ticks.minRotation = 90;
      } else {
        chart.options.scales.x.ticks.maxRotation = 45;
        chart.options.scales.x.ticks.minRotation = 45;
      }
    },
  };

  useEffect(() => {
    fetchEnrolledStudents();
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (enrolledstd && enrolledstd.length > 0) {
      const totalEarnings = enrolledstd.reduce((sum, course) => sum + (course.price * (course.enrollmentCount || 0)), 0);
      const totalStudents = enrolledstd.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);

      setStats((prevStats) => ({
        ...prevStats,
        totalEarnings,
        totalStudents,
      }));
 
      // Update Enrollment Data (Bar Chart)
      const enrollmentLabels = enrolledstd.map((course) => course.title || "Unknown");
      const enrollmentValues = enrolledstd.map((course) => course.enrollmentCount || 0);

      setEnrollmentData({
        labels: enrollmentLabels,
        datasets: [
          {
            label: "Students Enrolled",
            data: enrollmentValues,
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      });

      // Update Earnings Data (Line Chart)
      const earningsLabels = enrolledstd.map((course) => course.title || "Unknown");
      const earningsValues = enrolledstd.map((course) => (course.price * (course.enrollmentCount || 0)) || 0);

      setEarningsData({
        labels: earningsLabels,
        datasets: [
          {
            label: "Earnings ($)",
            data: earningsValues,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      }); 

    } else {
      console.log("No enrolled students data available.");
    }
  }, [enrolledstd]);

  const fetchEnrolledStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/courses/instructor-enrollments`, { withCredentials: true });
      const data = response.data || [];
      setEnrolledstd(data); 
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const coursesResponse = await axios.get(`${API_URL}/api/courses/get-courses`, { withCredentials: true });
      const courses = Array.isArray(coursesResponse.data) ? coursesResponse.data : coursesResponse.data.courses || [];
      setRecentCourses(courses);
      setStats((prevStats) => ({ ...prevStats, totalCourses: courses.length })); 
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Pagination logic
  const displayedCourses = recentCourses.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    { title: "Course Title", dataIndex: "title", key: "title" },
    { title: "Instructor", dataIndex: "instructor", key: "instructor", render: (instructor) => instructor?.name || "N/A" },
    { title: "Price ($)", dataIndex: "price", key: "price" },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Earnings" value={stats.totalEarnings.toFixed(2)} prefix="$" valueStyle={{ color: "#3f8600" }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Students" value={stats.totalStudents} valueStyle={{ color: "#cf1322" }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Courses" value={stats.totalCourses} valueStyle={{ color: "#1890ff" }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="Earnings Graph">
            {loading ? (
              <Spin />
            ) : earningsData.labels.length > 0 ? (
              <div style={{ height: "300px" }}>
                <Line data={earningsData} options={chartOptions} />
              </div>
            ) : (
              <p>No earnings data available.</p>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Students Enrolled Graph">
            {loading ? (
              <Spin />
            ) : enrollmentData.labels.length > 0 ? (
              <div style={{ height: "300px" }}>
                <Bar data={enrollmentData} options={chartOptions} />
              </div>
            ) : (
              <p>No enrollment data available.</p>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card title="Recent Courses">
            <Table columns={columns} dataSource={displayedCourses} rowKey="_id" pagination={false} loading={loading} />
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={recentCourses.length}
              onChange={handlePageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Quick Actions">
            <div className="flex flex-col gap-4">
              <Link to="/dashboard/addcourses">
                <Button type="primary" block>
                  Create New Course
                </Button>
              </Link>
              <Link to="/dashboard/courses">
                <Button block>View Analytics</Button>
              </Link>
              <Link to="/dashboard/courses">
                <Button block>Manage Courses</Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>

      <Link to="/" className="text-decoration-none text-black fs-5 pt-2">
        <p>
          <FaArrowLeftLong /> Back To Homepage
        </p>
      </Link>
    </div>
  );
};

export default DashboardHome;