import React from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  BookOutlined,
  SolutionOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <Sider
      collapsible
      breakpoint="lg" // Collapses on screens smaller than lg (992px)
      collapsedWidth="0" // Collapses to 0 width on mobile
      onBreakpoint={(broken) => {
        console.log("Breakpoint triggered:", broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log("Collapsed:", collapsed, "Type:", type);
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
          background: "#001529", // Match the sidebar background
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)", // Optional separator
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "1.5rem",
            color: "#fff",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          Skilify
        </h1>
      </div>

      {/* Menu Items */}
      <Menu
        theme="dark"
        mode="inline"
        style={{ marginTop: "10px", flex: 1 }} // Adjusted marginTop and added flex
        onClick={({ key }) => navigate(key)}
      >
        <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="/dashboard/admin/courses" icon={<SolutionOutlined />}>
          Courses
        </Menu.Item>
        <Menu.Item key="/dashboard/admin/users" icon={<TeamOutlined />}>
          Users
        </Menu.Item>
        <Menu.Item key="/dashboard/admin/profile" icon={<UserOutlined />}>
          Profile
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default AdminSidebar;