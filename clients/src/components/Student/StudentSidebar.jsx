import React from "react";
import { Layout, Menu } from "antd";
import {
  BookOutlined,
  HomeOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const StudentSidebar = () => {
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
          background: "#001529",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      > 
      </div>

      {/* Menu Items */}
      <Menu
        theme="dark"
        mode="inline"
        style={{ marginTop: "10px", flex: 1 }} // Adjusted marginTop to match instructor sidebar
        onClick={({ key }) => navigate(key)} // Navigate on menu click
      >
        <Menu.Item key="/dashboard/student" icon={<HomeOutlined />}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="/dashboard/student/enrollments" icon={<BookOutlined />}>
          My Enrollments
        </Menu.Item>
        <Menu.Item key="/dashboard/student/profile" icon={<UserAddOutlined />}>
          Profile
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default StudentSidebar;