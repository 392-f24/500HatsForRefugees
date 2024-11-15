import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [filterType, setFilterType] = useState('all');
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState(5);

  const events = [
    { id: 1, type: 'collaboration', name: 'Knitting for Warmth', location: 'Community Center', zip: '10001', hours: '10am - 4pm' },
    { id: 2, type: 'drop-off', name: 'Drop-Off - North Side', location: 'Library', zip: '10003', hours: '9am - 6pm' },
    { id: 3, type: 'collaboration', name: 'Winter Knit-A-Thon', location: 'Local Café', zip: '10005', hours: '1pm - 5pm' },
    { id: 4, type: 'drop-off', name: 'Drop-Off - East Side', location: 'Community Center', zip: '10007', hours: '10am - 5pm' },
  ];

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleZipChange = (e) => {
    setZipCode(e.target.value);
  };

  const handleRadiusChange = (e) => {
    setRadius(e.target.value);
  };

  const filterEvents = (events) => {
    return events.filter(event => {
      if (filterType !== 'all' && event.type !== filterType) return false;

      if (zipCode && radius) {
        if (event.zip !== zipCode) return false;  // Simplified for example
      }

      return true;
    });
  };

  const filteredEvents = filterEvents(events);

  return (
    <div className="App">
      <nav className="App-nav">
        <div className="App-logo">500 Hats for Refugees</div>
        <div className="App-nav-links">
          <a href="#our-team">Our Team</a>
          <a href="#how-we-work">How We Work</a>
          <a href="#our-mission">Our Mission</a>
          <button className="sign-in-button">Sign In</button>
        </div>
      </nav>

      <header className="App-header">
        <h1>500 Hats for Refugees</h1>
        <p>Join our efforts to knit hats for refugees by attending events or dropping off hats at nearby venues.</p>

        {/* Filter Controls */}
        <div className="filters">
          <label>
            Venue Type:
            <select value={filterType} onChange={handleFilterChange}>
              <option value="all">All</option>
              <option value="collaboration">Collaboration Events</option>
              <option value="drop-off">Drop-Off Venues</option>
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

        {/* Event Listings */}
        <div className="event-list">
          {filteredEvents.length ? (
            filteredEvents.map(event => (
              <div key={event.id} className="event">
                <h2>{event.name}</h2>
                <p>Location: {event.location}</p>
                <p>Hours: {event.hours}</p>
              </div>
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </header>
    </div>
  );
};

export default App;
