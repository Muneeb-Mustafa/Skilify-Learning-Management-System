import React from "react";
import { Input, Avatar, Dropdown, Menu } from "antd";
import { SearchOutlined, BellOutlined, UserOutlined } from "@ant-design/icons"; 
import { useAuthContext } from "../../context/AuthContext";

const DashboardHeader = () => {
  const { logout } = useAuthContext(); 

  const handleLogout = async () => {
    await logout(); // Call logout function
  };

  const menu = (
    <Menu> 
      <Menu.Item key="3" onClick={handleLogout}> 
        Sign Out
      </Menu.Item>
    </Menu>
  );

  return (
    <header
      style={{
        background: "#001529",
        color: "#fff",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
    > 

      {/* Center: Search Bar */}
      <div style={{ flex: 1, margin: "0 24px" }}>
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          style={{
            borderRadius: "8px",
            height: "40px",
          }}
        />
      </div>

      {/* Right: Notifications and Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Notifications */}
        <BellOutlined
          style={{
            fontSize: "20px",
            color: "#fff",
            cursor: "pointer",
          }}
        />

        {/* Profile Dropdown */}
        <Dropdown overlay={menu} placement="bottomRight">
          <Avatar
            style={{
              backgroundColor: "#001529",
              cursor: "pointer",
            }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </div>
    </header>
  );
};

export default DashboardHeader;
