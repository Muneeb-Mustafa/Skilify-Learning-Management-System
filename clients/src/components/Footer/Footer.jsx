import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer style={{ backgroundColor: '#1C1E53', color: 'white' }}>
            <Container className="pt-5 pb-4">
                <Row className="d-flex justify-content-center">
                    <Col xs={12} lg={4} md={6} className="mb-4 text-start">
                        <h5 className="text-uppercase">Skilify</h5>
                        <p>
                            Build and achieve your dreams with Skilify.
                        </p>
                        <div className="contact row p-2">
                            <div className="col-12 col-md-6 mb-3">
                                <h6 className="text-capitalize font-weight-bold mb-2 text-black">Email</h6>
                                <Link to="mailto:muneeb.m.dev@gmail.com" className="text-1 text-decoration-none text-black">
                                    skilify@gmail.com
                                </Link>
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                                <h6 className="text-capitalize font-weight-bold mb-2 text-black">Phone</h6>
                                <Link to="tel:+628899922233" className="text-2 text-decoration-none text-black">
                                    <div className="d-block">+92 307-5501821</div>
                                </Link>
                            </div>
                        </div>
                    </Col>

                    <Col xs={6} lg={2} md={6} className="mb-4 text-center">
                        <h5 className="text-uppercase">Social Media</h5>
                        <ul className="list-unstyled mb-0">
                            <li><Link to="#!" className="text-white text-decoration-none">Instagram</Link></li>
                            <li><Link to="#!" className="text-white text-decoration-none">Twitter</Link></li>
                            <li><Link to="#!" className="text-white text-decoration-none">LinkedIn</Link></li>
                        </ul>
                    </Col>

                    <Col xs={6} lg={2} md={6} className="mb-4 text-center">
                        <h5 className="text-uppercase">Programs</h5>
                        <ul className="list-unstyled mb-0">
                            <li><Link to="#!" className="text-white text-decoration-none">Independent Learning</Link></li>
                            <li><Link to="#!" className="text-white text-decoration-none">Finterpreneur</Link></li>
                        </ul>
                    </Col>

                    <Col xs={6} lg={2} md={6} className="mb-4 text-center">
                        <h5 className="text-uppercase">Support</h5>
                        <ul className="list-unstyled mb-0">
                            <li><Link to="#!" className="text-white text-decoration-none">About Us</Link></li>
                            <li><Link to="#!" className="text-white text-decoration-none">Terms</Link></li>
                            <li><Link to="#!" className="text-white text-decoration-none">Privacy Policy</Link></li>
                        </ul>
                    </Col>
                </Row>
            </Container>
            <div
                className="row text-center d-flex justify-content-center align-items-center"
                style={{ backgroundColor: '#fff', color: '#000' }}
            >
                <div className="col-12 col-md-4 text-black py-3">
                    <div>© Copyright Skilify {year} - 2029</div>
                </div>
                <div className="col-12 col-md-6 text-center py-3 links">
                    <Nav className="justify-content-center text-black">
                        <Nav.Link href="#" className="text-black">HOME</Nav.Link>
                        <Nav.Link href="#" className="text-black">ABOUT US</Nav.Link>
                        <Nav.Link href="#" className="text-black">COURSES</Nav.Link>
                        <Nav.Link href="#" className="text-black">FAQ</Nav.Link>
                        <Nav.Link href="#" className="text-black">BLOG</Nav.Link>
                    </Nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;