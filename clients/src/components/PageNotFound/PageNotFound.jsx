import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const PageNotFound = () => {
  const navigate = useNavigate();

  const goToHomepage = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">
          <span className="digit yellow">4</span>
          <span className="digit dark">0</span>
          <span className="digit yellow">4</span>
        </div>
        <h2>Oops... Page Not Found</h2>
        <p>Sorry, the page you are looking for could not be found.<br/>Please make sure the URL is correct.</p>
        <button className="homepage-button" onClick={goToHomepage}>Go to Homepage</button>
      </div>
    </div>
  );
};

export default PageNotFound;
