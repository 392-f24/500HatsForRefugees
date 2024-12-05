// LandingPage.jsx

import { useState, useEffect } from 'react';
import { useDbData, useDbRemove, useDbUpdate } from '../utilities/firebase.js';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [events, eventsError] = useDbData('/events'); // Fetch events data from Firebase
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    if (events) {
      const today = new Date();
      
      const filteredAndSortedEvents = Object.values(events)
        .filter((event) => new Date(event.Date) >= today) // Keep only events with future dates
        .sort((a, b) => new Date(a.Date) - new Date(b.Date)); // Sort by date in ascending order
      
      setUpcomingEvents(filteredAndSortedEvents);
    }
  }, [events]);

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
          <button className="yellow-btn" onClick={handleGetInvolvedClick}>
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

        <div className="eventsList">
          {eventsError && <p>Error loading events: {eventsError.message}</p>}
          {!events && <p>Loading events...</p>}
          {upcomingEvents.map((event, index) => (
            <Card key={index} className="event-card-upcoming">
              <Card.Body>
                <Card.Title className="event-title-upcoming">{event.Type}</Card.Title>
                <Card.Text>
                  <strong>Date:</strong> {new Date(event.Date).toLocaleDateString()}<br />
                  <strong>Location:</strong> {event.Location}<br />
                  <strong>Hats Needed:</strong> {event.HatsNeeded}<br />
                  <strong>Address:</strong> {event.Address}<br />
                </Card.Text>
                <div className="centered">
                  <Button className="yellow-btn">More Info</Button>
                </div>
                
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;