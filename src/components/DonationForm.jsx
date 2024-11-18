import React, { useState } from 'react';
import './AddEvent.css';
import { useDbUpdate, useDbData, useAuthState } from '../utilities/firebase';

const DonationForm = ({ closeModal }) => {
  const [user] = useAuthState();
  const [donationItem, setDonationItem] = useState('Knitted Hats');
  const [donationMode, setDonationMode] = useState('Dropoff at Donation Event');
  const [selectedEventID, setSelectedEventID] = useState('');
  const [hatQuantity, setHatQuantity] = useState('');
  const [monetaryAmt, setMonetaryAmt] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [updateData] = useDbUpdate('/donations');
  const [events, eventsError] = useDbData('/events');

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modalBackground') {
      closeModal(false);
    }
  };

  const handleSubmit = async () => {
    if (!donationItem || (!monetaryAmt && donationItem === 'Money') || (!hatQuantity && donationItem !== 'Money')) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!street || !city || !state || !zip) {
      alert('Please complete the location details.');
      return;
    }

    const newDonationID = Date.now().toString();
    const newDonation = {
      DonationItem: donationItem,
      DonationStatus: 'pending',
      DonorID: user?.uid || 'Anonymous',
      LocationOfDonor: `${street}, ${city}, ${state}, ${zip}`,
      DonationMode: donationMode,
      HatQuantity: donationItem !== 'Money' ? parseInt(hatQuantity, 10) : null,
      MonetaryAmt: donationItem === 'Money' ? parseInt(monetaryAmt, 10) : null,
      SelectedEventID: donationMode === 'Dropoff at Donation Event' ? selectedEventID : null,
    };

    try {
      await updateData({ [newDonationID]: newDonation });
      console.log('Donation submitted successfully!');
      closeModal(false);
    } catch (error) {
      console.error('Error submitting donation:', error);
    }
  };

  const renderEventOptions = () => {
    if (!events) return <option>Loading events...</option>;
    if (eventsError) return <option>Error loading events</option>;

    return Object.entries(events).map(([eventID, event]) => (
      <option key={eventID} value={eventID}>
        {event.Type} at {event.Location} ({event.Date})
      </option>
    ));
  };

  return (
    <div className="modalBackground" onClick={handleOverlayClick}>
      <div className="modalContainer">
        <div className="title">
          <h2>Make a Donation</h2>
        </div>
        <div className="modalBody">
          <p className="inputSection">Donation Item</p>
          <select
            className="input fullWidth"
            value={donationItem}
            onChange={(e) => setDonationItem(e.target.value)}
          >
            <option value="Knitted Hats">Knitted Hats</option>
            <option value="Unused Hats">Unused Hats</option>
            <option value="Second-Hand Hats">Second-Hand Hats</option>
            <option value="Money">Money</option>
          </select>

          {donationItem === 'Money' ? (
            <>
              <p className="inputSection">Monetary Amount</p>
              <input
                className="input fullWidth"
                type="number"
                value={monetaryAmt}
                onChange={(e) => setMonetaryAmt(e.target.value)}
                placeholder="Amount in USD"
              />
            </>
          ) : (
            <>
              <p className="inputSection">Hat Quantity</p>
              <input
                className="input fullWidth"
                type="number"
                value={hatQuantity}
                onChange={(e) => setHatQuantity(e.target.value)}
                placeholder="Number of hats"
              />
            </>
          )}

          <p className="inputSection">Donation Mode</p>
          <select
            className="input fullWidth"
            value={donationMode}
            onChange={(e) => setDonationMode(e.target.value)}
          >
            <option value="Dropoff at Donation Event">Dropoff at Donation Event</option>
            <option value="delivery by mail">Delivery by Mail</option>
          </select>

          {donationMode === 'Dropoff at Donation Event' && (
            <>
              <p className="inputSection">Select Event</p>
              <select
                className="input fullWidth"
                value={selectedEventID}
                onChange={(e) => setSelectedEventID(e.target.value)}
              >
                <option value="">Select an event</option>
                {renderEventOptions()}
              </select>
            </>
          )}

          <p className="inputSection">Donor Location</p>
          <input
            className="input fullWidth"
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Street"
          />
          <input
            className="input fullWidth"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
          <input
            className="input fullWidth"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
          />
          <input
            className="input fullWidth"
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="ZIP Code"
          />
        </div>
        <div className="footer">
          <button id="cancelBtn" onClick={() => closeModal(false)}>
            Cancel
          </button>
          <button id="saveBtn" onClick={handleSubmit}>
            Donate
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
