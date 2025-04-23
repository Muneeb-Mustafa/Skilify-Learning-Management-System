import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaUserCircle, FaBars, FaTimes, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Spin } from 'antd';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';

const Header = () => {
    const { isLoggedIn, logout, checkAuth, loading, user, setIsLoggedIn } = useAuthContext();
    const navigate = useNavigate();
    const [isSpin, setIsSpin] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setIsLoggedIn(true);
            }
        });
        return () => unsubscribe();
    }, [setIsLoggedIn]);

    const handleLogout = async () => {
        setIsSpin(true);
        try {
            if (auth.currentUser) {
                await signOut(auth);
            }
            await logout();
            navigate("/auth/login");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsSpin(false);
        }
    };

    const dashboardLink = user?.role === "instructor" ? "/dashboard/instructor" : "/dashboard/student";

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className='header-container pt-3 pb-3 px-4'>
            <Container>
                <Navbar expand="lg" expanded={expanded} className="justify-content-between">
                    <Navbar.Brand as={Link} to="/" className='text-light fw-bold fs-4'>Skilify</Navbar.Brand>

                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"
                        onClick={() => setExpanded(!expanded)}
                        className="custom-toggler text-center"
                    >
                        {expanded ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </Navbar.Toggle>

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto text-center">
                            <Link to="/" className="nav-link" onClick={() => setExpanded(false)}>Home</Link>
                            <Link to="/courses" className="nav-link" onClick={() => setExpanded(false)}>Courses</Link>
                            <Link to="/terms-of-service" className="nav-link" onClick={() => setExpanded(false)}>Terms of Service</Link>
                            <Link to="/privacy-policy" className="nav-link" onClick={() => setExpanded(false)}>Privacy Policy</Link>
                        </Nav>

                        <div className="auth-section">
                            {(isLoggedIn || auth.currentUser) ? (
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant="light"
                                        id="dropdown-basic"
                                        className="d-flex align-items-center bg-transparent border-0 text-light profile-toggle"
                                    >
                                        <FaUserCircle size={28} className="me-2" />
                                        <span className="d-none d-lg-inline">{user?.name || 'Profile'}</span>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu align="end" className="profile-dropdown">
                                        <Dropdown.Item as={Link} to={dashboardLink} onClick={() => setExpanded(false)} className="text-dark d-flex align-items-center">
                                            <FaTachometerAlt className="me-2 text-primary" /> Dashboard
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout} className="text-dark d-flex align-items-center">
                                            {isSpin ? (
                                                <>
                                                    <Spin size="small" className="me-2" /> Logging out...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSignOutAlt className="me-2 text-danger" /> Sign Out
                                                </>
                                            )}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <Link to="/auth/login" className="btn login" onClick={() => setExpanded(false)}>Login</Link>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
        </div>
    );
};

export default Header;