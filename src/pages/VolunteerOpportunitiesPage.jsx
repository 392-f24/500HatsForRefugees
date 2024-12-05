import { useState, useEffect } from 'react';
import { useDbData, useAuthState } from '../utilities/firebase.js';
import { Card, Button } from 'react-bootstrap';
import './VolunteerOpportunitiesPage.css';
import axios from 'axios';
import './Pages.css';
import AddEvent from '../components/AddEvent';
import DonationForm from '../components/DonationForm';
import GoogleMapComponent from '../components/GoogleMapComponent';
import { useNavigate } from 'react-router-dom';

const VolunteerOpportunitiesPage = () => {
  const [filterType, setFilterType] = useState('all');
  const [zipCode, setZipCode] = useState('60201');
  const [radius, setRadius] = useState(null); // Set initial radius to null
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [showAddEvent, setAddEvent] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [dbEvents, eventsError] = useDbData('/events'); // Fetch events data from Firebase

  // Filter events by status
  const eventsByStatus = dbEvents
    ? Object.keys(dbEvents)
      .map((key) => ({ id: key, ...dbEvents[key] }))
      .filter((event) => event.EventStatus === 'accepted')
    : [];

  // Filter by upcoming events
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  };

  // Upcoming events
  const events = eventsByStatus.filter(
    (event) => parseDate(event.Date) >= today
  );

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleZipChange = (e) => {
    setZipCode(e.target.value);
  };

  const handleRadiusChange = (e) => {
    setRadius(e.target.value ? parseFloat(e.target.value) : null); // Convert to float or set to null
  };

  // Function to geocode an address
  const geocodeAddress = async (address, apiKey) => {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  };

  // Function to calculate the distance between two coordinates
  const calculateDistance = (coord1, coord2) => {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
    const dLng = (coord2.lng - coord1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.lat * (Math.PI / 180)) *
      Math.cos(coord2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  //added by haichen  auth needed for request event /donation button:
  const [user] = useAuthState();
  const navigate = useNavigate();
  const handleAddEventClick = () => {
    if (!user) {
      navigate('/login'); // Redirect to login if unauthorized
    } else {
      setAddEvent(true); // Open the form if authorized
    }
  };

  const handleDonateClick = () => {
    if (!user) {
      navigate('/login'); // Redirect to login if unauthorized
    } else {
      setShowDonationForm(true); // Open the form if authorized
    }
  };

  useEffect(() => {
    const filterEventsByDistanceAndType = async () => {
      if (!events || !zipCode) return;

      console.log('Filtering events...');
      console.log('ZIP Code:', zipCode);
      console.log('Radius:', radius);
      console.log('Event Type:', filterType);
      console.log('Events:', events);

      const apiKey = "AIzaSyAI7wOB4XNX5xCMJsuA-XqWlSlzxDRNU9c";
      const zipCodeCoordinates = await geocodeAddress(zipCode, apiKey);
      console.log('ZIP Code Coordinates:', zipCodeCoordinates);

      const eventCoordinates = await Promise.all(
        Object.keys(events).map(async (eventId) => {
          const event = events[eventId];
          const address = event.Address;
          const coordinates = await geocodeAddress(address, apiKey);
          console.log(`Coordinates for event ${eventId} (${address}):`, coordinates);
          return { eventId, coordinates, event };
        })
      );

      // Apply filters for event type and distance
      const filteredEventIds = eventCoordinates.filter(({ event, coordinates }) => {
        // Filter by event type
        const isEventTypeMatch = filterType === 'all' || event.Type === filterType;

        // Filter by distance (only if radius is set)
        const isDistanceMatch = radius === null || calculateDistance(zipCodeCoordinates, coordinates) <= radius;

        return isEventTypeMatch && isDistanceMatch;
      }).map(({ eventId }) => eventId);

      console.log('Filtered Event IDs:', filteredEventIds);

      setFilteredEvents(filteredEventIds.map(eventId => events[eventId]));
      console.log('Filtered Events:', filteredEvents);
    };

    filterEventsByDistanceAndType();
  }, [events, zipCode, radius, filterType]);

  return (
    <div className="pageWrapper">
      {/* Main content for the Volunteer Opportunities Page goes here */}
      <div className="GetInvolved-container">
        <h1 className="title">Volunteer Opportunities</h1>
        <h5 className="subtitle">Find out how you can get involved and help make a difference.</h5>

        {showAddEvent && (
          <AddEvent show={showAddEvent} closeModal={() => setAddEvent(false)} />
        )}

        {showDonationForm && <DonationForm show={showDonationForm} closeModal={() => setShowDonationForm(false)} />}        <h4 className="sectionTitle">Upcoming Events</h4>

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
            <select value={radius || ''} onChange={handleRadiusChange}>
              <option value="">All</option>
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
              {filteredEvents.map((event, index) => (
                <Card key={index} className="event-card">
                  <Card.Body>
                    <Card.Title className="event-title">{event.Type}</Card.Title>
                    <Card.Text>
                      <strong>Date:</strong> {event.Date}<br />
                      <strong>Location:</strong> {event.Location}<br />
                      <strong>Hats Needed:</strong> {event.HatsNeeded}<br />
                      <strong>Address:</strong> {event.Address}<br />
                      {/* <strong>Status:</strong> {event.EventStatus} */}
                    </Card.Text>
                    <Button className="yellow-btn">More Info</Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
            <div className="mapContainer">
              <GoogleMapComponent events={filteredEvents} zipCode={zipCode} radius={radius} />
            </div>
          </div>
        )}
        <div className='btn-section'>
          <button className="yellow-btn" onClick={handleAddEventClick}>
            Request an Event
          </button>
          <button className="yellow-btn" onClick={handleDonateClick}>
            Donate Today!
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerOpportunitiesPage;
