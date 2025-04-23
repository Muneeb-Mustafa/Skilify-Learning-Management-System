import React, { useState } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

const faqData = [
  {
    id: 1,
    question: "Is this course completely free?",
    answer:
      "Yes, the courses provided are free to support the needs in the field of education.",
  },
  {
    id: 2,
    question: "Who is this course for?",
    answer: "This course is for anyone who wants to enhance their skills.",
  },
  {
    id: 3,
    question: "Are the courses certified?",
    answer: "Yes, all courses come with recognized certifications.",
  },
  {
    id: 4,
    question: "How long will the courses be available?",
    answer:
      "The courses have no expiration date; you can access them anytime.",
  },
  {
    id: 5,
    question: "Is there job placement after graduation?",
    answer: "Yes! We also provide job placement services.",
  },
];

const Faq = () => {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <Container className="faq-section py-5">
      <Row className="flex-column flex-md-row">
        <Col md={6} className="faq-sidebar mb-4 mb-md-0">
          <h4>Frequently Asked Questions</h4>
          <p>
            Still confused or unsure? Contact us at{" "}
            <a
              href="tel:+92 307 550 1821"
              style={{ textDecoration: "none", color: "#2405F2" }}
            >
              +92 307 550 1821
            </a>
            .
          </p>
        </Col>
        <Col md={6}>
          <Accordion defaultActiveKey="0" flush>
            {faqData.map((faq) => (
              <Accordion.Item
                eventKey={faq.id.toString()}
                key={faq.id}
                onClick={() => toggleFaq(faq.id)}
              >
                <Accordion.Header>
                  <span className="faq-number">
                    {faq.id < 10 ? `0${faq.id}` : faq.id}
                  </span>
                  <span className="faq-question">{faq.question}</span>
                  <span className="faq-icon">
                    {openId === faq.id ? (
                      <RxCross2 />
                    ) : (
                      <FaPlus />
                    )}
                  </span>
                </Accordion.Header>
                <Accordion.Body className="faq-answer">
                  {faq.answer}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default Faq;