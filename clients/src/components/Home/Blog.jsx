import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const BlogCard = ({ title, date, description, imageSrc, link }) => {
  return (
    <Col xs={12} md={4} className="mb-4">
      <Card className="blog-card">
        <Card.Img variant="top" src={imageSrc} alt={title} />
        <Card.Body>
          <Card.Title className="blog-date">{date}</Card.Title>
          <Card.Title>{title}</Card.Title>
          <Card.Text className="blog-description">
            {description}
          </Card.Text>
          <Link to={link} className="blog-link">
            Read More <FaArrowRightLong />
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );
};

const Blog = () => {
  const blogData = [
    {
      title: "Easy Ways to Start Learning Programming - Skilify",
      date: "January 19, 2022",
      description: "Becoming a programmer is now easier than ever and can be learned by anyone.",
      imageSrc: "/Images/Home/blog1.png",  
      link: "#",
    },
    {
        title: "Tips for Creating a Business Landing Page Website - Skilify",
        date: "January 19, 2022",
        description: "The importance of a website in building trust in your business makes it essential...",
        imageSrc: "/Images/Home/blog2.png",  
        link: "#",
    },
    {
        title: "How to Install WordPress for Beginners - Skilify",
        date: "January 19, 2022",
        description: "Creating a website is now possible without coding. You can make one using...",
        imageSrc: "/Images/Home/blog3.png",  
        link: "#",
    },
  ];

  return (
    <div className="container bloghome">
      <div className="row">
        <div className="col-6 text-left fw-bold">
          <h1 className='fw-bold'>
            Blogs, News, and Events
          </h1>
        </div>
        <div className="learnbtn col-6 text-end">
          <Link to="#" className="btn btn-link text-black text-decoration-none" style={{ paddingRight: "50px" }}>
            View Learning Path <FaArrowRightLong />
          </Link>
        </div>
      </div>
      <Row className='blog-card mt-5'>
        {blogData.map((blog) => (
          <BlogCard
            key={blog.title}
            title={blog.title}
            date={blog.date}
            description={blog.description}
            imageSrc={blog.imageSrc}
            link={blog.link}
          />
        ))}
      </Row>
    </div>
  );
};

export default Blog;
