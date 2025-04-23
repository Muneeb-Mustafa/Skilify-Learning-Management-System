import React, { useEffect, useState } from 'react';
import { Breadcrumb, Spin, Alert, Button, Table, Input } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import { useAuthContext } from '../../../context/AuthContext';
import { SearchOutlined } from '@ant-design/icons';
import { useDashContext } from '../../../context/DashboardContext';

const Students = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { enrolledstd, setEnrolledstd } = useDashContext();

  // Fetch instructor enrollments
  const fetchInstructorEnrollments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/courses/instructor-enrollments`, { withCredentials: true });
      setCourses(data);
      setEnrolledstd(data);
      setFilteredCourses(data);
    } catch (err) {
      setError('Failed to load enrolled students.');
      console.error('Error fetching instructor enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'instructor' || user?.role === 'admin') {
      fetchInstructorEnrollments();
    } else {
      setError('You are not authorized to view this page.');
      setLoading(false);
    }
  }, [user]);

  const handleRefresh = () => {
    fetchInstructorEnrollments();
  };

  // Handle search input
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchValue)
    );
    setFilteredCourses(filtered);
  };

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
      width: 150,
      ellipsis: true,
      render: (text) => <span style={{ fontWeight: '600', color: '#1a73e8' }}>{text}</span>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price) => <span style={{ color: '#2ecc71' }}>${price.toFixed(2)}</span>,
      responsive: ['md'],
    },
    {
      title: 'Enrolled Students',
      key: 'enrolledStudents',
      width: 300,
      render: (_, record) => (
        <ul style={{ paddingLeft: '15px', margin: 0, color: '#555' }}>
          {record.enrolledStudents?.length > 0 ? (
            record.enrolledStudents.map((student) => (
              <li key={student.studentId} style={{ marginBottom: '5px' }}>
                <span style={{ fontWeight: '500' }}>{student.studentName}</span> (
                <a href={`mailto:${student.studentEmail}`} style={{ color: '#1a73e8' }}>
                  {student.studentEmail}
                </a>
                ) - Enrolled on{' '}
                <span style={{ color: '#888' }}>
                  {new Date(student.enrollmentDate).toLocaleDateString()}
                </span>
              </li>
            ))
          ) : (
            <span style={{ color: '#999' }}>No students enrolled</span>
          )}
        </ul>
      ),
    },
    {
      title: 'Enrollment Count',
      dataIndex: 'enrollmentCount',
      key: 'enrollmentCount',
      width: 120,
      render: (count) => (
        <span style={{ background: '#e6f7ff', padding: '4px 8px', borderRadius: '12px', color: '#1a73e8' }}>
          {count}
        </span>
      ),
      responsive: ['md'],
    },
  ];

  if (error) {
    return (
      <div className="container mt-5">
        <Alert message={error} type="error" showIcon style={{ maxWidth: '500px', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="students-container">
      <div className="container">
        {/* Breadcrumb */}
        <Breadcrumb
          className="custom-breadcrumb"
          items={[
            { title: <Link to="/" style={{ color: '#1a73e8' }}>Home</Link> },
            { title: <span style={{ color: '#555' }}>Students</span> },
          ]}
        />

        {/* Header Section */}
        <div className="header-section">
          <h2 className="header-title hide-on-mobile">
            Enrolled Students
          </h2>
          <Button
            onClick={handleRefresh}
            className="refresh-button"
          >
            Refresh
          </Button>
        </div>

        {/* Search Bar */}
        <Input
          placeholder="Search courses by title..."
          prefix={<SearchOutlined style={{ color: '#888' }} />}
          onChange={handleSearch}
          className="search-bar"
        />

        {/* Table Section */}
        <Spin spinning={loading} tip="Loading student data..." indicator={<Spin size="large" />}>
          <div className="table-wrapper">
            {filteredCourses.length > 0 ? (
              <Table
                dataSource={filteredCourses}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 10, responsive: true }}
                expandable={{
                  expandedRowRender: (record) => (
                    <div className="expanded-row">
                      <p className="expanded-row-text">
                        <strong>Subtitle:</strong> {record.subtitle || 'N/A'}
                      </p>
                      <p className="expanded-row-text">
                        <strong>Total Lectures:</strong>{' '}
                        {record.chapters?.reduce((total, chapter) => total + (chapter.lectures?.length || 0), 0) || 0}
                      </p>
                    </div>
                  ),
                }}
                scroll={{ x: 'max-content' }}
                rowClassName={() => 'table-row-hover'}
              />
            ) : (
              <p className="no-data-text">
                No courses with enrolled students found.
              </p>
            )}
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default Students;