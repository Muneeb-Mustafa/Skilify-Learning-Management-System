import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Breadcrumb, Spin, Alert, Form, Input, Button, message, Row, Col } from "antd";
import axios from "axios";
import { API_URL } from "../../config";

const EnrollCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/api/courses/single-course/${courseId}`, { withCredentials: true });
        setCourse(data);
      } catch (err) {
        setError("Failed to load course details.");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const onFinish = async (values) => {
    try {
      const { email, paymentMethod, saveInformation } = values;
      await axios.post(
        `${API_URL}/api/courses/enroll/${courseId}`,
        { email, paymentMethod, saveInformation },
        { withCredentials: true }
      );
      message.success("Enrollment successful!");
      navigate(`/dashboard/student/enrollments`);
    } catch (error) {
      message.error("Failed to enroll. Please try again.");
      console.error("Error enrolling in course:", error);
    }
  };

  if (error) return <Alert message={error} type="error" showIcon className="m-4" />;
  if (loading) return <Spin spinning tip="Loading course details..." className="flex justify-center items-center h-screen" />;

  return (
    <div className="container mx-auto px-4 py-4">
      <Breadcrumb
        items={[
          { title: <Link to="/" className="text-decoration-none">Home</Link> },
          { title: <Link to="/courses" className="text-decoration-none">Courses</Link> },
          { title: course ? course.title : "Enroll Course" },
        ]}
        className="mb-6"
      />

      {course && (
        <Row gutter={[16, 24]} className="mt-4">
          {/* Left Section: Course Title and Price */}
          <Col xs={24} md={12}>
            <div className="p-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h2>
              <p className="text-xl text-gray-700">${course.price}</p>
            </div>
          </Col>

          {/* Right Section: Enrollment Form */}
          <Col xs={24} md={12}>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <Form onFinish={onFinish} layout="vertical">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
                >
                  <Input placeholder="Enter your email" size="large" />
                </Form.Item>

                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <Form.Item name="paymentMethod">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" value="card" defaultChecked /> Card
                    </label> <br/>
                    <label className="flex items-center gap-2 ">
                      <input type="radio" value="cashapp" /> Cash App Pay
                    </label>
                  </div>
                </Form.Item>

                <Form.Item name="saveInformation" valuePropName="checked">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Securely save my information for 1-click checkout
                  </label>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
                    block
                  >
                    Pay
                  </Button>
                </Form.Item>
              </Form>
              <p className="text-muted text-sm mt-4 text-center">
                Powered by Skilify |{" "}
                <Link to="/terms-of-service" className="text-decoration-none">Terms</Link> |{" "}
                <Link to="/privacy-policy" className="text-decoration-none">Privacy</Link>
              </p>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default EnrollCourse;