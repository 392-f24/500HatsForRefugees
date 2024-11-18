import { useState, useEffect } from 'react';
import { useDbData, useDbRemove, useDbUpdate } from '../utilities/firebase.js';
import './Pages.css'
import AddEvent from '../components/AddEvent';
import DonationForm from '../components/DonationForm';

const VolunteerOpportunitiesPage = () => {
  const [showAddEvent, setAddEvent] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);

  return (
    <div className="pageWrapper">

      {/* Main content for the Volunteer Opportunities Page goes here */}
      <div className="GetInvolved-container">
        <h1 className="title">Volunteer Opportunities</h1>
        <h5 className="subtitle">Find out how you can get involved and help make a difference.</h5>
        <h4 className="sectionTitle"> Upcoming Events</h4>

        <h4 className="sectionTitle"> About Our Events</h4>


        <div style={{ display: "flex-column", justifyContent: "center", alignItems: "center" }}>
          <button className="addEvent-button" onClick={() => setAddEvent(true)}>
            Request an Event
          </button> 
          <button className="addEvent-button" onClick={() => setShowDonationForm(true)}>
            Donate Today!
          </button>
        </div>
      </div>


      {showAddEvent && (
        <AddEvent
          closeModal={() => setAddEvent(false)}
        />
      )}
      {showDonationForm && <DonationForm closeModal={() => setShowDonationForm(false)} />}
    </div>
  );
};

export default VolunteerOpportunitiesPage;
