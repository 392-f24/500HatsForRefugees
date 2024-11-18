import { useState } from 'react';
import { useDbData } from '../utilities/firebase.js';
import { Card, Button } from 'react-bootstrap';
import './VolunteerOpportunitiesPage.css';
import AddEvent from '../components/AddEvent';
import GoogleMapComponent from '../components/GoogleMapComponent';
import './Pages.css'

const VolunteerOpportunitiesPage = () => {
  const [filterType, setFilterType] = useState('all');
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState(5);
  
  const [showAddEvent, setAddEvent] = useState(false);
  const [events, eventsError] = useDbData('/events'); // Fetch events data from Firebase

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };
  const handleZipChange = (e) => {
    setZipCode(e.target.value);
  };
  const handleRadiusChange = (e) => {
    setRadius(e.target.value);
  };

  // Filter events based on the selected event type
  const filteredEvents = events
    ? Object.keys(events).filter(eventId => filterType === 'all' || events[eventId].Type === filterType)
    : [];

  return (
    <div className="pageWrapper">
      {/* Main content for the Volunteer Opportunities Page goes here */}
      <div className="GetInvolved-container">
        <h1 className="title">Volunteer Opportunities</h1>
        <h5 className="subtitle">Find out how you can get involved and help make a difference.</h5>

        {showAddEvent && (
          <AddEvent closeModal={() => setAddEvent(false)} />
        )}

        <h4 className="sectionTitle">Upcoming Events</h4>

        {/* Filter Controls */}
        <div className="filterControls">
          <label>
            Event Type:
            <select value={filterType} onChange={handleFilterChange}>
              <option value="all">All</option>
              <option value="Hats and Hot Chocolate">Hats and Hot Chocolate</option>
              <option value="Hat Knitting">Hat Knitting</option>
            </select>
          </label>
          <label>
            Zip Code:
            <input type="text" value={zipCode} onChange={handleZipChange} placeholder="Enter ZIP" />
          </label>
          <label>
            Radius (miles):
            <select value={radius} onChange={handleRadiusChange}>
              <option value="5">5 miles</option>
              <option value="10">10 miles</option>
              <option value="20">20 miles</option>
            </select>
          </label>
        </div>

        {eventsError && <p>Error loading events: {eventsError.message}</p>}
        {!events && <p>Loading events...</p>}
        {events && (
          <div className="contentWrapper">
            <div className="eventsList">
              {filteredEvents.map((eventId) => {
                const event = events[eventId];
                return (
                  <Card key={eventId} className="event-card">
                    <Card.Body>
                      <Card.Title className="event-title">{event.Type}</Card.Title>
                      <Card.Text>
                        <strong>Date:</strong> {event.Date}<br />
                        <strong>Location:</strong> {event.Location}<br />
                        <strong>Hats Needed:</strong> {event.HatsNeeded}<br />
                        <strong>Address:</strong> {event.Address}<br />
                        {/* <strong>Status:</strong> {event.EventStatus} */}
                      </Card.Text>
                      <Button className="more-info-button">More Info</Button>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
            <div className="mapContainer">
              <GoogleMapComponent events={filteredEvents.map(eventId => events[eventId])} zipCode={zipCode} radius={radius} />
            </div>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="addEvent-button" onClick={() => setAddEvent(true)}>
            Request an Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerOpportunitiesPage;