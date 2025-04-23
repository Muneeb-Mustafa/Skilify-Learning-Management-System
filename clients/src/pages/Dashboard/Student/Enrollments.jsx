import React, { useEffect, useState } from 'react';
import { Breadcrumb, Spin, Alert, Button, Modal, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/courses/enrollments`, { withCredentials: true });
      const uniqueEnrollments = Array.from(
        new Map(data.map(item => [item.courseId._id, item])).values()
      );
      setEnrollments(uniqueEnrollments);
    } catch (err) {
      setError('Failed to load enrollments.');
      console.error('Error fetching enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleContinue = (courseId) => {
    navigate(`/dashboard/student/course/${courseId}`);
  };

  const handleRefresh = () => {
    fetchEnrollments();
  };

  const showCertificateModal = (course) => {
    setSelectedCourse(course);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (studentName && selectedCourse) {
      generateCertificate(selectedCourse, studentName);
    }
    setIsModalVisible(false);
    setStudentName('');
    setSelectedCourse(null);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setStudentName('');
    setSelectedCourse(null);
  };

  const generateCertificate = async (course, name) => {
    const currentDate = new Date().toLocaleDateString();
    const certificationNumber = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    
    // Generate QR code URL (customize this URL as needed)
    const verificationUrl = `https://yourdomain.com/verify?cert=${certificationNumber}&course=${course._id}`;
    let qrCodeDataUrl;
    
    try {
      qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 100,
        margin: 1,
        color: {
          dark: '#0066b2',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H' // High error correction for better scanning
      });
    } catch (err) {
      console.error('Error generating QR code:', err);
      qrCodeDataUrl = 'https://via.placeholder.com/100?text=QR+Error';
    }

    const certificateHTML = `
      <div id="certificate" style="width: 1500px; height: 800px; background-color: white; text-align: center; font-family: 'Arial', sans-serif; position: relative; border: 15px solid #0066b2; padding: 20px; box-sizing: border-box;">
        <!-- Blue sidebar accent -->
        <div style="position: absolute; top: 0; right: 0; width: 40px; height: 100%; background-color: #0066b2;"></div>
        <div style="position: absolute; top: 0; left: 0; width: 40px; height: 100%; background-color: #0066b2;"></div>
        
        <!-- Header -->
        <h1 style="color: #0066b2; font-size: 70px; margin: 50px 0 0; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-family: 'Arial Black', sans-serif;">CERTIFICATE</h1>
        <h2 style="color: #00a7e1; font-size: 38px; margin: 0 0 50px; font-weight: normal; text-transform: uppercase; letter-spacing: 1px; font-family: 'Arial', sans-serif;">OF ACHIEVEMENT</h2>
        
        <!-- Presented To -->
        <p style="font-size: 20px; margin: 20px 0 10px; color: #333; font-family: 'Arial', sans-serif;">This certificate is presented to</p>
        <h2 style="color: #993300; font-size: 46px; margin: 0 0 30px; font-weight: bold; font-family: 'Arial Black', sans-serif;">${name}</h2>
        
        <!-- Course Details -->
        <p style="font-size: 20px; margin: 30px 0 10px; color: #333; font-family: 'Arial', sans-serif;">for successfully completing a Course about</p>
        <h3 style="color: #ff6600; font-size: 32px; margin: 0 0 70px; font-weight: bold; font-family: 'Arial Black', sans-serif;">${course.title}</h3>
        
        <!-- Main content area with 3 columns -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin: 0 60px 50px;">
          <!-- Left column - Logo and Signature -->
          <div style="text-align: center; width: 33%;">
            <div style="background-color: #00a7e1; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
              <span style="color: white; font-size: 36px; font-weight: bold;">SK</span>
            </div>
            <p style="margin: 0; font-size: 18px; color: #333;">Skilify</p>
            <div style="margin-top: 10px; border-top: 2px solid #00a7e1; padding-top: 5px;">
              <p style="font-family: 'Brush Script MT', cursive; font-size: 40px; color: #0066b2; margin: 0;">Skilify</p>
              <p style="margin: 0; font-size: 16px; color: #333;">Signature</p>
            </div>
          </div>
          
          <!-- Middle column - Certificate Info -->
          <div style="text-align: center; width: 33%;">
            <p style="font-size: 16px; color: #333; margin: 5px 0;">Course Start Date: ${currentDate}</p>
            <p style="font-size: 16px; color: #333; margin: 5px 0;">Certified No: ${certificationNumber}</p>
            <p style="font-size: 16px; color: #333; margin: 5px 0;">Course Duration: ${course.duration || '1 hour'}</p>
            
            <!-- Gold seal/badge -->
            <div style="margin: 15px auto;">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="#FFD700" stroke="#CC9900" stroke-width="2" />
                <circle cx="50" cy="50" r="42" fill="#FFEB99" />
                <circle cx="50" cy="50" r="38" fill="#FFD700" />
                <text x="50" y="45" text-anchor="middle" fill="#CC9900" font-size="16" font-weight="bold">Skilify</text>
                <text x="50" y="65" text-anchor="middle" fill="#CC9900" font-size="12">Certified</text>
              </svg>
            </div>
          </div>
          
          <!-- Right column - QR Code & Date -->
          <div style="text-align: center; width: 33%;">
            <img src="${qrCodeDataUrl}" style="width: 100px; height: 100px; margin: 0 auto 10px; display: block;" alt="Certificate Verification QR Code" />
            <p style="font-size: 18px; color: #333; margin: 5px 0;">${currentDate}</p>
            <div style="margin-top: 10px; border-top: 2px solid #00a7e1; padding-top: 5px;">
              <p style="margin: 0; font-size: 16px; color: #333;">Date</p>
            </div>
          </div>
        </div>
        
        <!-- Certification Shield -->
        <div style="position: absolute; left: 100px; bottom: 100px;">
          <svg width="120" height="140" viewBox="0 0 120 140">
            <path d="M10,10 L110,10 L110,90 C110,120 60,140 60,140 C60,140 10,120 10,90 Z" fill="#0066b2" />
            <path d="M15,15 L105,15 L105,85 C105,115 60,135 60,135 C60,135 15,115 15,85 Z" fill="#ffffff" />
            <text x="60" y="55" text-anchor="middle" fill="#0066b2" font-size="14" font-weight="bold">Certified</text>
            <text x="60" y="75" text-anchor="middle" fill="#0066b2" font-size="14" font-weight="bold">Member</text>
          </svg>
        </div>
      </div>
    `;
  
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = certificateHTML;
    document.body.appendChild(tempDiv);
  
    // Load required fonts
    const fontLinkArial = document.createElement('link');
    fontLinkArial.href = 'https://fonts.googleapis.com/css2?family=Arial&display=swap';
    fontLinkArial.rel = 'stylesheet';
    document.head.appendChild(fontLinkArial);
  
    const fontLinkScript = document.createElement('link');
    fontLinkScript.href = 'https://fonts.googleapis.com/css2?family=Brush+Script+MT&display=swap';
    fontLinkScript.rel = 'stylesheet';
    document.head.appendChild(fontLinkScript);
  
    // Wait for fonts and QR code to load
    setTimeout(() => {
      html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
  
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${course.title}_Certificate_${name}.pdf`);
  
        // Cleanup
        document.body.removeChild(tempDiv);
        document.head.removeChild(fontLinkArial);
        document.head.removeChild(fontLinkScript);
      }).catch(err => {
        console.error('Error generating PDF:', err);
        document.body.removeChild(tempDiv);
        document.head.removeChild(fontLinkArial);
        document.head.removeChild(fontLinkScript);
      });
    }, 500);
  };

  if (error) {
    return <Alert message={error} type="error" showIcon className="enrollments-error" />;
  }

  if (loading) {
    return (
      <div className="enrollments-loading">
        <Spin spinning tip="Loading enrollments..." />
      </div>
    );
  }

  return (
    <div className="enrollments-container">
      <Breadcrumb
        items={[
          { title: <Link to="/" className="enrollments-breadcrumb-link">Home</Link> },
          { title: 'My Enrollments' },
        ]}
      />

      <div className="enrollments-content">
        <div className="enrollments-header">
          <h2>My Enrollments</h2>
          <Button onClick={handleRefresh} className="enrollments-refresh-btn">
            Refresh
          </Button>
        </div>
        <div className="enrollments-card">
          <table className="enrollments-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Category</th>
                <th>Completed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.length > 0 ? (
                enrollments.map((enrollment) => {
                  const course = enrollment.courseId;
                  const courseTitle = course?.title || 'Unknown Course';
                  const courseImage = course?.thumbnail || 'https://via.placeholder.com/60';
                  const category = course?.category || 'N/A';
                  const completedLecturesCount = enrollment.completedLectures?.length || 0;
                  const totalLectures = course?.totalLectures || course.chapters?.reduce((total, chapter) => total + (chapter.lectures?.length || 0), 0) || 1;
                  const completedPercentage = (completedLecturesCount / totalLectures) * 100 || 0;
                  const isCompleted = completedLecturesCount === totalLectures;

                  return (
                    <tr key={enrollment._id} className="enrollments-row">
                      <td data-label="Course">
                        <div className="enrollments-course-info">
                          <img
                            src={courseImage}
                            alt={courseTitle}
                            className="enrollments-course-image"
                          />
                          <div className="enrollments-course-details">
                            <div className="enrollments-course-title">{courseTitle}</div>
                            <div className="enrollments-course-subtitle">{course?.subtitle || 'No subtitle'}</div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Category">{category}</td>
                      <td data-label="Completed">
                        <div className="enrollments-progress-container">
                          <div className="enrollments-progress-bar">
                            <div
                              className="enrollments-progress-fill"
                              style={{ width: `${completedPercentage}%` }}
                            />
                          </div>
                          <small className="enrollments-progress-text">
                            {completedLecturesCount}/{totalLectures} Lectures
                          </small>
                        </div>
                      </td>
                      <td data-label="Status">
                        {isCompleted ? (
                          <Button
                            type="primary"
                            onClick={() => showCertificateModal(course)}
                            className="enrollments-certificate-btn"
                          >
                            View Certificate
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            onClick={() => handleContinue(course._id)}
                            className="enrollments-status-btn ongoing"
                          >
                            On Going
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="enrollments-empty">
                    No enrollments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title="Generate Certificate"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Generate"
        cancelText="Cancel"
      >
        <p>Please enter your name for the certificate:</p>
        <Input
          placeholder="Your Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Enrollments;