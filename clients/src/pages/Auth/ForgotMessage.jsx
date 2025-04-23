import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";

const ForgotMessage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#1C1E53', color: '#fff', textAlign: 'center' }}>
      <div className="p-5 rounded shadow-lg" style={{ backgroundColor: '#252B48', padding: '50px', borderRadius: '10px', maxWidth: '450px' }}>
        <FaCheckCircle size={60} color="#FCD980" />
        <h2 className="mt-3">Password Reset Email Sent</h2>
        <p className="mt-2" style={{ color: '#F4F6FC' }}>
          We've sent a password reset link to your email. Please check your inbox and follow the instructions.
        </p>
        <Link to="/auth/login">
          <button className="btn btn-danger w-100 fw-bold" style={{ backgroundColor: '#FCD980', color: '#000', padding: "12px 20px", marginTop: "20px" }}>
            Back to Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ForgotMessage;
