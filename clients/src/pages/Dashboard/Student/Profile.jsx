import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Avatar, Button, Form, Input, Upload, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAuthContext } from "../../../context/AuthContext";
import { API_URL } from '../../../config';

const Profile = () => {
  const { user, setUser } = useAuthContext();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/auth/profile`, { withCredentials: true });
      setProfileData(data.user);
      form.setFieldsValue(data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("bio", values.bio || "");
      formData.append("socialLinks", values.socialLinks || "");

      // Check if fileList has a file and append it directly
      if (fileList.length > 0) {
        const file = fileList[0]; 
        formData.append("file", file); // Use the file object directly 
      } else {
        console.log("No file selected in fileList");
      }
 
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const { data } = await axios.put(`${API_URL}/api/auth/profile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 5000,
      });

      setProfileData(data.user);
      setUser(data.user);
      message.success("Profile updated successfully");
      setFileList([]);
    } catch (error) {
      message.error("Failed to update profile");
      console.error("Error updating profile:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => { 
      setFileList([file]);
      return false; // Prevent automatic upload
    },
    fileList,
    maxCount: 1,
    accept: "image/*",
  };

  if (!profileData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div className="profile-header">
          <Avatar
            size={120}
            src={profileData.profilePicture || "https://via.placeholder.com/120"}
            className="profile-avatar"
          />
          <h2>{profileData.name || "No Name"}</h2>
        </div>

        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            initialValues={profileData}
            className="profile-form"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Email is required" }]}
            >
              <Input disabled placeholder="Your email" />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="password"
              rules={[{ min: 6, message: "Password must be at least 6 characters" }]}
            >
              <Input.Password placeholder="Enter new password (optional)" />
            </Form.Item>

            <Form.Item label="Profile Picture" name="profilePicture">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Upload New Picture</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="save-button"
                style={{ backgroundColor: "#001529", borderColor: "#001529" }}
              >
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default Profile;