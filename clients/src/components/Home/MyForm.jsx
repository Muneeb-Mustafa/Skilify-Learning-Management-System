import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from '../../config';
import axios from 'axios';

const initialState = {
  name: '',
  emails: '',
  messages: '',
};

const MyForm = () => {
  const [input, setInput] = useState(initialState);

  const handleChange = (e) =>
    setInput((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { name, emails, messages } = input;

    if (!name) return toast.error('Please enter your full name');
    if (name.trim().length < 3)
      return toast.error('Name must be at least 3 characters long');
    if (!emailRegex.test(emails))
      return toast.error('Please enter a valid email address');
    if (!messages) return toast.error('Please enter your message');

    try {
      await axios.post(`${API_URL}/api/auth/leads`, input);
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error during form submission: ', error);
      toast.error(
        error.response?.data?.error || 'Failed to send message. Please try again.'
      );
    }
  };

  return (
    <Container className="form-container">
      <Row>
        <Col
          md={6}
          className="bg-image d-flex justify-content-center align-items-start p-5 text-left"
        >
          <div className="text-section pt-5">
            <h2>Get Closer to Your Dreams</h2>
            <p>
              A free E-Learning service designed to help you become an expert in
              your field.
            </p>
          </div>
          <div className="overlay"></div>
        </Col>
        <Col
          md={6}
          className="form-section p-5 text-light d-flex justify-content-center align-items-center"
        >
          <Form onSubmit={handleSubmit}>
            <h3 className="pb-3">Stay Updated</h3>
            <p className="pb-3">
              Prepare yourself for a bright future filled with opportunities.
            </p>
            <Form.Group controlId="formBasicName" className="pb-3">
              <Form.Control
                type="text"
                placeholder="Your Name"
                name="name"
                value={input.name}
                style={{
                  background: 'transparent',
                  borderColor: '#F4F6FC',
                  color: '#fff',
                  padding: '15px',
                }}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail" className="pb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                name="emails"
                value={input.emails}
                style={{
                  background: 'transparent',
                  borderColor: '#F4F6FC',
                  color: '#fff',
                  padding: '15px',
                }}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicMessage" className="pb-3">
              <Form.Control
                as="textarea"
                placeholder="Type your message here"
                name="messages"
                value={input.messages}
                rows={4}
                style={{
                  background: 'transparent',
                  borderColor: '#F4F6FC',
                  padding: '15px',
                  color: '#fff',
                }}
                onChange={handleChange}
              />
            </Form.Group>

            <button
              type="submit"
              className="btn btn-danger w-100 text-uppercase fw-bold"
              style={{
                backgroundColor: '#FCD980',
                padding: '12px 25px',
              }}
            >
              Send Message
            </button>

            <p className="mt-3 text-center">
              Already have an account? <Link to="/auth/login">Login</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default MyForm;
