import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { useDbUpdate, useAuthState } from '../utilities/firebase';
import './ModalForm.css';  // Make sure to import the custom CSS file

const GetInvolvedNow = ({ show, closeModal, event }) => {
  const [user] = useAuthState();
  const [updateData] = useDbUpdate();
  const [volunteerState, setVolunteerState] = useState(true);
  const [hasRSVPed, setHasRSVPed] = useState(false);

  useEffect(() => {
    if (!user || !event) {
      setVolunteerState(false);
      return;
    }
    const userHasRSVP = user.hasRSVP?.includes(event.id);
    const eventFull = event.MaxVolunteerNum <= event.CurrentVolunteerNum;

    if (userHasRSVP || eventFull) {
      setVolunteerState(false);
    } else {
      setVolunteerState(true);
    }
  }, [user, event]);

  const handleRSVP = async () => {
    if (!user || !volunteerState) {
      return;
    }

    try {
      const newVolunteer = {
        username: user.displayName || user.email,
        seen: false,
        id: user.uid,
      };

      await updateData({
        [`/events/${event.id}/CurrentVolunteerNum`]: (event.CurrentVolunteerNum || 0) + 1,
        [`/events/${event.id}/CurrentVolunteers`]: [
          ...(event.CurrentVolunteers || []),
          newVolunteer,
        ],
      });

      await updateData({
        [`/users/${user.uid}/hasRSVP`]: [
          ...(user.hasRSVP || []),
          event.id,
        ],
      });

      setHasRSVPed(true);
      setVolunteerState(false);
      console.log('RSVP successful!');
    } catch (error) {
      console.error('Error during RSVP:', error);
    }
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
      <Modal.Header closeButton className="custom-modal-header x-button">
        {/* <Modal.Title className="title">{event?.Type || 'Event Details'}</Modal.Title> */}
      </Modal.Header>
      <Modal.Body className="modalBody">
        <h4 className="sub-title-involved">Get Involved</h4>
        <Modal.Title className="title-involved">{event?.Type || 'Event Details'}</Modal.Title>

        <h4 className="sub-title" style={{marginTop:"20px"}}>Event Details</h4>
        <div className="detailsText">
          <p><strong>Date:</strong> {event?.Date}</p>
          <p><strong>Location:</strong> {event?.Location}</p>
          <p><strong>Address:</strong> {event?.Address}</p>
        </div>


        {event?.Type === 'Hats and Hot Chocolate' && (
          <div className="GetInvovledSection">
            <h3 className="sub-title-involved-section">Volunteer Responsibiliites</h3>
            <div className="detailsText-section">
              {Array.isArray(event?.VolunteerResponsibilities) && event.VolunteerResponsibilities.length > 0 ? (
                event.VolunteerResponsibilities.map((responsibility, index) => (
                  <p key={index}>{responsibility}</p>
                ))
              ) : (
                <>
                  <p>Assist Margie in transportation - Car appreciated</p>
                  <p>Spanish Speakers Wanted!</p>
                  <p>Arrive at Evanston Library 30 minutes early to help set up</p>
                  <p>Help Margie take down setup</p>
                </>
              )}
            </div>


            <p className="centered" style={{ color: "#FFDF8F", fontWeight: "bold" }}>
              Spots left: {event?.MaxVolunteerNum - event?.CurrentVolunteerNum || 0}
            </p>
            <div className="centered">
              {!user && (
                <p className="error-text">Log in prior to RSVP</p>
              )}
              {event?.MaxVolunteerNum === event?.CurrentVolunteerNum && (
                <p className="error-text">Volunteer capacity reached</p>
              )}
              {hasRSVPed && (
                <p className="success-text">Thank you for volunteering!</p>
              )}
              <button
                className={
                  volunteerState
                    ? 'yellow-btn-involved'
                    : 'yellow-btn-involved-disabled'
                }
                disabled={!volunteerState}
                onClick={handleRSVP}
              >
                RSVP to Volunteer Now
              </button>
            </div>



            <h3 className="sub-title-involved-section">Donations Needed</h3>
            <div className="detailsText-section">
            <p style={{ color: "#FFDF8F", fontWeight: "bold" }}>
              No need to RSVP, bring your donations directly to the event!
            </p>
              <p>Hot Chocolate Packets</p>
              <p>Hot Water Machines</p>
              <p>Hats - of course</p>
              <p>Any other snacks</p>
            </div>
          </div>
          )}


        {/* <Form>
          <Form.Group className="mb-3">
            <Form.Label className="inputSection">Event Type</Form.Label>
            <Form.Select 
              className="input fullWidth" 
              value={event?.Type} 
              disabled
            >
              <option value="Hats and Hot Chocolate">Hats and Hot Chocolate</option>
              <option value="Hat Knitting">Hat Knitting</option>
            </Form.Select>
          </Form.Group>


        </Form> */}
      </Modal.Body>
      <Modal.Footer className="modalFooter centered ">


      </Modal.Footer>
    </Modal>
  );
};

export default GetInvolvedNow;