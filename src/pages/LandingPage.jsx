// LandingPage.jsx

import { useState, useEffect } from 'react';
import { useDbData, useDbRemove, useDbUpdate } from '../utilities/firebase.js';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetInvolvedClick = () => {
    navigate('/volunteerOpportunities');
  };

  return (
    <div className="LandingPage-container">
      {/* Volunteer Section */}
      <div className="VolunteerWithUsContainer">
        <div className="VWU-left">
          <h1 className="titleVolunteer">Volunteer</h1>
          <h1 className="titleWithUs">With Us</h1>
          <h6 className="landingDescription">
            500 Hats for Refugees is a nonprofit dedicated to helping refugees through their first, cold Chicago winter.
          </h6>
          <button className="volunteer-button" onClick={handleGetInvolvedClick}>
            Get Involved Now!
          </button>
        </div>
        <div className="VWU-right">
          <img 
            src="/LandingPageImage.jpg" 
            alt="Volunteer with us" 
            className="imageContainer" 
          />
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="UpcomingEventsContainer">
        <h1 className="UpcomingEvents">Upcoming Events</h1>
      </div>
    </div>
  );
};

export default LandingPage;
