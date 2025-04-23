import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { toast } from 'react-toastify';
import { API_URL } from '../../config';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email address");
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      toast.success(response.data.message);
      navigate('/auth/forgot-message'); // Navigate after success
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Row>
        <Col md={6} className="bg-login d-flex justify-content-center align-items-start text-left" style={{ padding: '110px' }}>
          <div className="text-section pt-5">
          <h2>A Step Closer to Your Dreams</h2>
          <p>A free E-Learning service ready to help you become an expert</p>
            <Link to='/' className='text-decoration-none'><p><FaArrowLeftLong />&nbsp;&nbsp; Back To Homepage</p></Link>
          </div>
          <div className="overlay"></div>
        </Col>
        <Col md={6} className="form-section p-5 text-light d-flex justify-content-center align-items-center">
          <Form onSubmit={handleSubmit}>
            <h3 className="pb-3">Forgot Password</h3>
            <p className="pb-3">Enter your email address to receive a password reset link.</p>
            <Form.Group controlId="formBasicEmail" className="pb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                style={{ background: 'transparent', borderColor: '#F4F6FC', color: '#fff', padding: '15px' }}
                onChange={handleChange}
              />
            </Form.Group>
            <button className="btn btn-danger w-100 text-uppercase fw-bold" style={{ backgroundColor: '#FCD980', padding: "12px 25px" }} disabled={loading}>
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
            <p className="mt-3 text-center text-decoration-none">
              Don't have an account? <Link to="/auth/register">Register</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;
