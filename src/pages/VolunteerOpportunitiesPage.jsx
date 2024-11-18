// VolunteerOpportunitiesPage.jsx

import { useState, useEffect } from 'react';
import { useDbData, useDbRemove, useDbUpdate } from '../utilities/firebase.js';
import './Pages.css'
import AddEvent from '../components/AddEvent';

const VolunteerOpportunitiesPage = () => {
  // const [carts, cartsError] = useDbData('/Cart');
  const [showAddEvent, setAddEvent] = useState(false);
  // const [updateData] = useDbUpdate(`/Cart/${cartId}`);

  return (
    <div className="pageWrapper">

      {/* Main content for the Volunteer Opportunities Page goes here */}
      <div className="GetInvolved-container">
        <h1 className="title">Volunteer Opportunities</h1>
        <h5 className="subtitle">Find out how you can get involved and help make a difference.</h5>
        <h4 className="sectionTitle"> Upcoming Events</h4>

        <h4 className="sectionTitle"> About Our Events</h4>


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
