// VolunteerOpportunitiesPage.jsx

import { useState, useEffect } from 'react';
import { useDbData, useDbRemove, useDbUpdate } from '../utilities/firebase.js';
import './VolunteerOpportunities.css'
import AddEvent from '../components/AddEvent';

const VolunteerOpportunitiesPage = () => {
  // const [carts, cartsError] = useDbData('/Cart');
  const [showAddEvent, setAddEvent] = useState(false);
  // const [updateData] = useDbUpdate(`/Cart/${cartId}`);

  return (
    <div>

      {/* Main content for the Volunteer Opportunities Page goes here */}
      <div className="GetInvolved-container">
        <h1>Volunteer Opportunities</h1>
        <p>Find out how you can get involved and help make a difference.</p>
        {/* Add volunteer opportunities, maps, or other content as needed */}

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="addEvent-button" onClick={() => setAddEvent(true)}>
            Request an Event
          </button> 
        </div>
      </div>


      {showAddEvent && (
        <AddEvent
          closeModal={() => setAddEvent(false)}
        />
      )}
    </div>
  );
};

export default VolunteerOpportunitiesPage;
