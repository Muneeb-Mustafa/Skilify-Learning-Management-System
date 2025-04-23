import React from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const Instructorsidebar = () => {
  const navigate = useNavigate();

  return (
    <Sider
      collapsible
      breakpoint="lg" // Collapses on screens smaller than lg (992px)
      collapsedWidth="0" // Collapses to 0 width on mobile
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
      className="custom-sider" // Add a custom class for styling
    >
      {/* Add Skilify Logo/Title at the top */}
      <div
        style={{
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#001529",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* <h1
          style={{
            margin: 0,
            fontSize: "1.5rem",
            color: "#fff",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          Skilify
        </h1> */}
      </div>

      {/* Menu Items */}
      <Menu
        theme="dark"
        mode="inline"
        style={{ marginTop: "10px", flex: 1 }}
        onClick={({ key }) => navigate(key)}
      >
        <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="/dashboard/instructor/addcourses" icon={<BookOutlined />}>
          Add Courses
        </Menu.Item>
        <Menu.Item key="/dashboard/instructor/courses" icon={<BookOutlined />}>
          Courses
        </Menu.Item>
        <Menu.Item key="/dashboard/instructor/students" icon={<UserOutlined />}>
          Students Enrolled
        </Menu.Item>
        <Menu.Item key="/dashboard/instructor/profile" icon={<UserOutlined />}>
          Profile
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Instructorsidebar;