import React, { useState } from "react";
import { Row, Col, Carousel, Image, Typography } from "antd";
const { Title, Paragraph, Text } = Typography;

const testimonials = [
  {
    text: "The material delivered is easy to understand, the instructors are excellent, and the response time is very fast. So, I highly, highly recommend the courses here!!",
    author: "Jenny Wilson",
    role: "Vice President",
    image: "/Images/Home/testimonial.png",
  },
  {
    text: "Skilify has transformed the way I learn! The courses are engaging, the support is exceptional, and I've gained so much knowledge.",
    author: "Robert Fox",
    role: "Software Engineer",
    image: "/Images/Home/testimonial.png",
  },
  {
    text: "An amazing platform for learners! The courses are high quality and extremely valuable. Highly recommend Skilify.",
    author: "Sarah Connor",
    role: "Creative Director",
    image: "/Images/Home/testimonial.png",
  },
];

const Testimonial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const onChange = (current) => {
    setCurrentSlide(current);
  };

  return (
    <div className="testimonial-container ">
      <Row 
        justify="space-between"
        align="middle"
        className="container"
        style={{ maxWidth: "1350px", margin: "0 auto" }}
      >
        <Col xs={24} lg={7} className="testimonial-left">
          <Text type="secondary" >What They Say About</Text>
          <Title level={1}>Skilify Courses</Title>
          <Paragraph>Skilify is trusted by more than 10,000 students.</Paragraph>
        </Col>
        <Col xs={24} lg={17} className="testimonial-right">
          <Carousel
            afterChange={onChange}
            autoplay
            autoplaySpeed={3000}
            style={{ width: "100%" }} // Ensure carousel takes full width
          >
            {testimonials.map((testimonial, index) => (
              <div key={index}>
                <blockquote>
                  <Paragraph>"{testimonial.text}"</Paragraph>
                  <div className="testimonial-author">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="author-image"
                      preview={false}
                      width={60}
                      height={60}
                    />
                    <div>
                      <Title level={5}>{testimonial.author}</Title>
                      <Paragraph type="secondary">{testimonial.role}</Paragraph>
                    </div>
                  </div>
                </blockquote>
              </div>
            ))}
          </Carousel>
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <span
                key={index}
                className={`dot ${currentSlide === index ? "active" : ""}`}
              ></span>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Testimonial;