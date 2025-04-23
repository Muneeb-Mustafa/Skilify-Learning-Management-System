import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { toast } from 'react-toastify';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { API_URL } from '../../config';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams(); 
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return toast.error("Please enter both password fields");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/reset-password`, { 
        token, 
        newPassword 
      });
      toast.success(response.data.message);
      navigate('/auth/login'); // Redirect to login
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Row>
        <Col md={6} className="bg-login d-flex justify-content-center align-items-start text-left" style={{ padding: '110px' }}>
          <div className="text-section pt-5">
            <h2>Reset Your Password</h2>
            <p>Enter a new password to regain access to your account.</p>
            <Link to='/' className='text-decoration-none'>
              <p><FaArrowLeftLong />&nbsp;&nbsp; Back To Homepage</p>
            </Link>
          </div>
        </Col>
        <Col md={6} className="form-section p-5 text-light d-flex justify-content-center align-items-center">
          <Form onSubmit={handleSubmit}>
            <h3 className="pb-3">Create New Password</h3>
            <Form.Group controlId="formNewPassword" className="pb-3 position-relative">
              <Form.Control
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                style={{ background: 'transparent', borderColor: '#F4F6FC', color: '#fff', padding: '15px' }}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div
                className="password-toggle-icon"
                style={{ position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeTwoTone style={{ color: '#fff' }} /> : <EyeInvisibleOutlined style={{ color: '#fff' }} />}
              </div>
            </Form.Group>
            <Form.Group controlId="formConfirmPassword" className="pb-3 position-relative">
              <Form.Control
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                style={{ background: 'transparent', borderColor: '#F4F6FC', color: '#fff', padding: '15px' }}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div
                className="password-toggle-icon"
                style={{ position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeTwoTone style={{ color: '#fff' }} /> : <EyeInvisibleOutlined style={{ color: '#fff' }} />}
              </div>
            </Form.Group>
            <button className="btn btn-danger w-100 text-uppercase fw-bold" style={{ backgroundColor: '#FCD980', padding: "12px 25px" }} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPassword;
