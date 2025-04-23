import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeftLong, FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa6";
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../../config';
import { auth, googleProvider, githubProvider, facebookProvider, signInWithPopup } from "../../config/firebase";
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const initialState = {  
  name: '', email: '', password: ''
};

const Register = () => { 
  const navigate = useNavigate();
  const [input, setInput] = useState(initialState); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setInput((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  

    const { name, email, password } = input;
    if (!name || name.trim().length < 3) return toast.error("Please enter your full name");
    if (!emailRegex.test(email)) return toast.error("Please enter a valid email address");
    if (password.trim().length < 6) return toast.error("Password must be at least 6 characters");

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/register`, input); 
      toast.success("Account successfully registered");
      navigate("/auth/login");
    } catch (error) {
      console.log("Error during form submission: ", error);
      toast.error("Failed to register, please try again later");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (providerType) => {
    let provider;
    if (providerType === "google") provider = googleProvider;
    if (providerType === "github") provider = githubProvider;
    if (providerType === "facebook") provider = facebookProvider;

    try {
      const result = await signInWithPopup(auth, provider); 
      toast.success(`Welcome, ${result.user.displayName || "User"}!`);
      navigate("/");
    } catch (error) {
      console.error("OAuth Login Error:", error);
      toast.error("Authentication failed, please try again.");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center">
      <Row className="w-100 mx-0">
        <Col xs={12} md={6} className="bg-register d-flex justify-content-center align-items-center text-left p-3 p-md-5">
          <div className="text-section">
            <h2 className="display-5 fw-bold">A Step Closer to Your Dreams</h2>
            <p className="lead">A free E-Learning service ready to help you become an expert</p>
            <Link to="/" className="text-decoration-none text-white">
              <p><FaArrowLeftLong /> Back To Homepage</p>
            </Link>
          </div>
        </Col>
        <Col xs={12} md={6} className="form-section p-3 p-md-5 text-light d-flex justify-content-center align-items-center">
          <Form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px' }}>
            <h3 className="pb-3">Register</h3>
            <p className="pb-3">Prepare yourself for a future full of opportunities and success.</p>
            <Form.Group controlId="formBasicName" className="pb-3">
              <Form.Control
                type="text"
                placeholder="Your Name"
                name="name"
                value={input.name}
                className="custom-input"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail" className="pb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={input.email}
                className="custom-input"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="pb-3">
              <Input.Password
                placeholder="Password"
                name="password"
                value={input.password}
                onChange={handleChange}
                iconRender={(visible) => (visible ? <EyeTwoTone style={{ color: '#fff' }} /> : <EyeInvisibleOutlined style={{ color: '#fff' }} />)}
                className="custom-input"
              />
            </Form.Group>
            <button 
              type="submit" 
              className="btn btn-danger w-100 text-uppercase fw-bold mb-3" 
              style={{ backgroundColor: '#FCD980', color: '#000', padding: '10px 20px' }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="mt-2 text-center">
              Already have an account? <Link to="/auth/login" className="text-white">Login</Link>
            </p>

            <div className="text-center mt-3">
              <p>Or sign up with:</p>
              <div className="d-flex flex-column flex-md-row justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-light flex-grow-1"
                  onClick={() => handleOAuthLogin('google')}
                >
                  <FaGoogle /> Google
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light flex-grow-1"
                  onClick={() => handleOAuthLogin('github')}
                >
                  <FaGithub /> GitHub
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light flex-grow-1"
                  onClick={() => handleOAuthLogin('facebook')}
                >
                  <FaLinkedin /> Facebook
                </button>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Register;