import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { useDbUpdate, useAuthState } from '../utilities/firebase';
import './ModalForm.css';  // Make sure to import the custom CSS file

const AddEvent = ({ show, closeModal }) => {
  const [user] = useAuthState();

  const [eventType, setEventType] = useState('Hats and Hot Chocolate');
  const [eventStatus] = useState('pending');
  const [requesterID] = useState(user ? user.uid : 'TemporaryRequesterID');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  // Additional fields for "Hats and Hot Chocolate"
  const [hispanicLatino, setHispanicLatino] = useState('');
  const [asian, setAsian] = useState('');
  const [white, setWhite] = useState('');
  const [africanAmerican, setAfricanAmerican] = useState('');
  const [americanIndian, setAmericanIndian] = useState('');
  const [hatsNeeded, setHatsNeeded] = useState('');
  const [requirements, setRequirements] = useState(false);

  const [updateData] = useDbUpdate('/events');

  const handleSave = async () => {
    if (!eventType || !location || !date || !startTime || !endTime || !street || !city || !state || !zip) {
        alert('Please fill in all required fields.');
      return;
    }

    const newEventId = Date.now().toString();
    const fullAddress = `${street}, ${city}, ${state} ${zip}`;
    const newEvent = {
      Type: eventType,
      EventStatus: eventStatus,
      RequesterID: requesterID,
      Location: location,
      Date: date,
      Time: {
        startTime,
        endTime
      },
      Address: fullAddress,
      Street: street,
      City: city,
      State: state,
      Zip: zip
    };

    if (eventType === 'Hats and Hot Chocolate') {
      newEvent.Demographics = {
        HispanicLatino: parseInt(hispanicLatino, 10),
        Asian: parseInt(asian, 10),
        White: parseInt(white, 10),
        AfricanAmerican: parseInt(africanAmerican, 10),
        AmericanIndian: parseInt(americanIndian, 10)
      };
      newEvent.HatsNeeded = parseInt(hatsNeeded, 10);
      newEvent.Requirements = requirements;
    }

    try {
      await updateData({ [newEventId]: newEvent });
      console.log("Event added successfully!");
      closeModal(false);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const isSaveDisabled = () => {
    if (!eventType || !location || !date || !startTime || !endTime || !street || !city || !state || !zip) return true;
    if (eventType === 'Hats and Hot Chocolate') {
      return (
        !hatsNeeded ||
        !hispanicLatino ||
        !asian ||
        !white ||
        !africanAmerican ||
        !americanIndian
      );
    }
    return false;
  };

  const autofillDemoData = () => {
    setEventType('Hats and Hot Chocolate');
    setLocation('Evanston Library');
    setDate('2024-11-21');
    setStartTime('10:00');
    setEndTime('14:00');
    setStreet('1703 Orrington Ave');
    setCity('Evanston');
    setState('IL');
    setZip('60201');
    setHispanicLatino('30');
    setAsian('20');
    setWhite('25');
    setAfricanAmerican('15');
    setAmericanIndian('10');
    setHatsNeeded('50');
    setRequirements(true);
  };

  return (
    <Modal
      show={show}
      onHide={() => closeModal(false)}
      centered
      size="lg"
      dialogClassName="custom-modal"
      contentClassName="custom-modal-content"
    >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title className="title">Request an Event from 500 Hats</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <h4 className="sub-title">Logistics</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="inputSection">Event Type</Form.Label>
              <Form.Select className="input fullWidth" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                <option value="Hats and Hot Chocolate">Hats and Hot Chocolate</option>
                <option value="Hat Knitting">Hat Knitting</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="inputSection">Date</Form.Label>
              <Form.Control className="input fullWidth" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="inputSection">Start Time</Form.Label>
              <Form.Control className="input fullWidth" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label className="inputSection">Location</Form.Label>
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


            {eventType === 'Hats and Hot Chocolate' && (
              <>
                <h4 className="sub-title">Hats & Hot Chocolate</h4>
                <Form.Group className="mb-3">
                  <Form.Label className="inputSection">Around how many hats are needed?</Form.Label>
                  <Form.Control
                    className="input fullWidth"
                    type="number"
                    value={hatsNeeded}
                    onChange={(e) => setHatsNeeded(e.target.value)}
                    placeholder="Hats Needed"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="inputSection">Demographics of serving population 
                    (Enter a number for each group's percentage)</Form.Label>
                  <Form.Control
                    className="input fullWidth"
                    type="number"
                    value={hispanicLatino}
                    onChange={(e) => setHispanicLatino(e.target.value)}
                    placeholder="Hispanic/Latino"
                  />
                  <Form.Control
                    className="input fullWidth"
                    type="number"
                    value={asian}
                    onChange={(e) => setAsian(e.target.value)}
                    placeholder="Asian"
                  />
                  <Form.Control
                    className="input fullWidth"
                    type="number"
                    value={white}
                    onChange={(e) => setWhite(e.target.value)}
                    placeholder="White"
                  />
                  <Form.Control
                    className="input fullWidth"
                    type="number"
                    value={africanAmerican}
                    onChange={(e) => setAfricanAmerican(e.target.value)}
                    placeholder="African American"
                  />
                  <Form.Control
                    className="input fullWidth"
                    type="number"
                    value={americanIndian}
                    onChange={(e) => setAmericanIndian(e.target.value)}
                    placeholder="American Indian"
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="modalFooter">
          <Button variant="secondary" className="yellow-btn" onClick={() => closeModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" className="yellow-btn" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outline-info" onClick={autofillDemoData}>
            Autofill Demo Data
          </Button>
        </Modal.Footer>
    </Modal>
  );
};

export default AddEvent;