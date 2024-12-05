import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { useDbUpdate, useDbData, useAuthState } from '../utilities/firebase';

const DonationForm = ({ show, closeModal }) => {
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
  const [dbEvents, eventsError] = useDbData('/events');

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

  const handleSubmit = async () => {
    if (!donationItem || (!monetaryAmt && donationItem === 'Money') || (!hatQuantity && donationItem !== 'Money')
      || (!selectedEventID && donationMode === 'Dropoff at Donation Event')) {
      alert('Please fill in all required fields.');
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
      received: false
    };

    try {
      await updateData({ [newDonationID]: newDonation });
      alert('Donation submitted successfully!');
      closeModal();
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
    <Modal
      show={show}
      onHide={closeModal}
      centered
      dialogClassName="custom-modal"
      contentClassName="custom-modal-content"
    >
      <Modal.Header className="custom-modal-header" closeButton>
        <Modal.Title className="title">Make a Donation</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="inputSection">Donation Item</Form.Label>
            <Form.Select
              className="input fullWidth"
              value={donationItem}
              onChange={(e) => setDonationItem(e.target.value)}
            >
              <option value="Knitted Hats">Knitted Hats</option>
              <option value="Unused Hats">Unused Hats</option>
              <option value="Second-Hand Hats">Second-Hand Hats</option>
              <option value="Money">Money</option>
            </Form.Select>
          </Form.Group>

          {donationItem === 'Money' ? (
            <Form.Group className="mb-3">
              <Form.Label className="inputSection">Monetary Amount</Form.Label>
              <Form.Control
                className="input fullWidth"
                type="number"
                value={monetaryAmt}
                onChange={(e) => setMonetaryAmt(e.target.value)}
                placeholder="Amount in USD"
              />
            </Form.Group>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label className="inputSection">Hat Quantity</Form.Label>
              <Form.Control
                className="input fullWidth"
                type="number"
                value={hatQuantity}
                onChange={(e) => setHatQuantity(e.target.value)}
                placeholder="Number of hats"
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="inputSection">Donation Mode</Form.Label>
            <Form.Select className="input fullWidth" value={donationMode} onChange={(e) => setDonationMode(e.target.value)}>
              <option value="Dropoff at Donation Event">Dropoff at Donation Event</option>
              <option value="delivery by mail">Delivery by Mail</option>
            </Form.Select>
          </Form.Group>

          {donationMode === 'Dropoff at Donation Event' && (
            <Form.Group className="mb-3">
              <Form.Label className="inputSection">Select Event</Form.Label>
              <Form.Select className="input fullWidth" value={selectedEventID} onChange={(e) => setSelectedEventID(e.target.value)}>
                <option value="">Select an event</option>
                {renderEventOptions()}
              </Form.Select>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="inputSection">Donor Location</Form.Label>
            <Form.Control
              className="input fullWidth"
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Street"
            />
            <InputGroup className="mt-2">
              <Form.Control
                className="input fullWidth"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
              <Form.Control
                className="input fullWidth"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
              />
              <Form.Control
                className="input fullWidth"
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="ZIP Code"
              />
            </InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="modalFooter">
        <Button variant="secondary" className="yellow-btn" onClick={closeModal}>
          Cancel
        </Button>
        <Button variant="primary" className="yellow-btn" onClick={handleSubmit}>
          Donate
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DonationForm;