import React, { useState, useEffect } from "react";
import { Table, Spin, Alert, Input, Layout, Menu, Button, message, Row, Col } from "antd"; 
import axios from "axios";
import { UserOutlined, SearchOutlined, BookOutlined, SyncOutlined } from "@ant-design/icons";
import { API_URL } from "../../../config";
import { useDashContext } from "../../../context/DashboardContext";

const { Header, Content } = Layout;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { setadminCourses } = useDashContext([]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/courses/get-course`, {
        withCredentials: true, // Send cookies automatically
      });
      const coursesData = Array.isArray(response.data.data) ? response.data.data : response.data;
      setCourses(coursesData);
      setadminCourses(coursesData);
      setFilteredCourses(coursesData);
      setLoading(false);
    } catch (err) {
      console.error("Error Fetching Courses:", err.response?.data || err.message);
      message.error(err.response?.data?.message || "Failed to fetch courses");
      setError(err.response?.data?.message || "Failed to fetch courses");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(value) ||
        course.subtitle.toLowerCase().includes(value) ||
        course.category.toLowerCase().includes(value) ||
        course.level.toLowerCase().includes(value)
    );
    setFilteredCourses(filtered);
  };

  const handleRefresh = () => {
    fetchCourses(); // Re-run the fetchCourses function
  };

  // Responsive columns configuration
  const getColumns = () => {
    return [
      { 
        title: "Title", 
        dataIndex: "title", 
        key: "title",
        ellipsis: true 
      },
      { 
        title: "Subtitle", 
        dataIndex: "subtitle", 
        key: "subtitle",
        responsive: ['xs', 'md', 'lg'],
        ellipsis: true
      },
      { 
        title: "Description", 
        dataIndex: "description", 
        key: "description",
        responsive: ['xs', 'md', 'lg'],
        // ellipsis: true,
        render: (text) => text.length > 50 ? text.substring(0, 50) + "..." : text
      },
      { 
        title: "Category", 
        dataIndex: "category", 
        key: "category",
        responsive: ['xs', 'md', 'lg']
      },
      { 
        title: "Level", 
        dataIndex: "level", 
        key: "level",
        responsive: ['xs', 'md', 'lg']
      },
      { 
        title: "Price", 
        dataIndex: "price", 
        key: "price", 
        render: (price) => `$${price}` 
      },
      { 
        title: "Thumbnail",
        dataIndex: "thumbnail",
        key: "thumbnail",
        responsive: ['xs', 'md', 'lg'],
        render: (thumbnail) => 
          thumbnail ? 
            <img 
              src={thumbnail} 
              alt="thumbnail" 
              style={{ maxWidth: "50px", height: "auto" }} 
            /> : 
            "No Image",
      },
      { 
        title: "Video",
        dataIndex: "video",
        key: "video",
        responsive: ['xs', 'md', 'lg'],
        render: (video) => video ? "Video Available" : "No Video",
      },
    ];
  };
  

  return (
    <Layout className="min-h-screen">
      <Header className="p-0">
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]} style={{ lineHeight: '64px' }}>
          <Menu.Item key="1" icon={<BookOutlined />}>Courses</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '20px' }} className="site-layout-content">
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} md={12}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>All Courses (Admin Dashboard)</h2>
          </Col>
          <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              icon={<SyncOutlined spin={loading} />}
              onClick={handleRefresh}
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                borderRadius: "5px",
                padding: "0 15px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
              }}
              disabled={loading}
            >
              Refresh
            </Button>
          </Col>
        </Row>
        
        <Row style={{ marginTop: '16px', marginBottom: '16px' }}>
          <Col xs={24} md={12} lg={8}>
            <Input
              placeholder="Search courses..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        
        {loading && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Spin size="large" />
          </div>
        )}
        
        {error && (
          <Alert 
            message="Error" 
            description={error} 
            type="error" 
            showIcon 
            style={{ marginBottom: '20px' }} 
          />
        )}
        
        {!loading && !error && (
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <Table
              dataSource={filteredCourses}
              columns={getColumns()}
              rowKey="_id"
              pagination={{ 
                pageSize: 10,
                responsive: true,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20']
              }}
              bordered
              scroll={{ x: 'max-content' }}
              size={window.innerWidth < 768 ? "small" : "middle"}
            />
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default Courses;