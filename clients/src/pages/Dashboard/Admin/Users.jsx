import React, { useState, useEffect } from "react";
import { Table, Spin, Alert, Input, Select, Layout, Menu, Button, message } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { UserOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { API_URL } from "../../../config";
import { useDashContext } from "../../../context/DashboardContext";

const { Header, Content } = Layout;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { setAllUsers } = useDashContext([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/auth/admin/users`, {
        withCredentials: true,
      });

      const usersData = Array.isArray(response.data.data) ? response.data.data : response.data;
      setUsers(usersData);
      setAllUsers(usersData);
      setFilteredUsers(usersData);
      setLoading(false);
    } catch (err) {
      console.error("Error Fetching Users:", err.response?.data || err.message);
      message.error(err.response?.data?.message || "Failed to fetch users");
      setError(err.response?.data?.message || "Failed to fetch users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `${API_URL}/api/auth/admin/update-role`,
        { userId, role: newRole },
        { withCredentials: true }
      );

      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      message.success("User role updated successfully");
    } catch (err) {
      console.error("Error Updating Role:", err.response?.data || err.message);
      message.error(err.response?.data?.message || "Failed to update role");
      setError(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.role.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role, record) => (
        <Select
          defaultValue={role}
          style={{ width: 120 }}
          onChange={(value) => handleRoleChange(record._id, value)}
        >
          <Option value="user">User</Option>
          <Option value="instructor">Instructor</Option>
          <Option value="admin">Admin</Option>
        </Select>
      ),
    },
    { title: "ID", dataIndex: "_id", key: "_id" },
  ];

  return (
    <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>Users</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "20px" }}>
        <div className="container-fluid">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <h2 className="mb-0">All Users (Admin Dashboard)</h2>
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
          </div>

          <Input
            placeholder="Search by name, email, or role"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: "100%", maxWidth: "400px", marginBottom: "20px" }}
          />

          {loading && (
            <div className="text-center">
              <Spin size="large" />
            </div>
          )}
          {error && (
            <Alert message="Error" description={error} type="error" showIcon className="mb-4" />
          )}

          {!loading && !error && (
            <div style={{ overflowX: "auto" }}>
              <Table
                dataSource={filteredUsers}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                bordered
                className="table table-striped table-hover"
                style={{ minWidth: "700px" }} // Prevents column collapse
              />
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Users;
