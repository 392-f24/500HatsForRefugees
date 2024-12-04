import React, { useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { Modal, Card, Spinner } from 'react-bootstrap';
import { useDbData } from '../utilities/firebase';
import './EventsPage.css';
import './InboxPage.css';

const EventsPage = () => {
    const [events, eventsError] = useDbData('events');
    const [selectedOption, setSelectedOption] = useState('upcoming'); // 'upcoming' or 'past'
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!events) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Loading events...</p>
            </div>
        );
    }

    // Separate past and upcoming events
    const today = new Date();
    const sortedEvents = Object.keys(events)
        .map((key) => ({ id: key, ...events[key] }))
        .filter((event) => event.EventStatus === 'accepted');

    const pastEvents = sortedEvents.filter(
        (event) => new Date(event.Date) < today
    );

    const upcomingEvents = sortedEvents.filter(
        (event) => new Date(event.Date) >= today
    );

    const handleToggleChange = (value) => setSelectedOption(value);

    const handleOpenModal = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const displayedEvents = selectedOption === 'past' ? pastEvents : upcomingEvents;

    // console.log(displayedEvents);

    return (
        <div className="page-container box-gap">
            <div className="box">
                <div className="box-content">
                    <div>
                        <div className="admin-inbox">Admin Events</div>
                        <div className="sub-title">See and manage events</div>
                    </div>
                    <ToggleButtonGroup
                        type="radio"
                        name="options"
                        value={selectedOption}
                        onChange={handleToggleChange}
                        className="toggle-button-group"
                    >
                        <ToggleButton id="tbg-radio-1" value="upcoming" className="d-flex align-items-center">
                            Upcoming
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-2" value="past" className="d-flex align-items-center">
                            Past
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>

            <div className="eventsList">
                <div className="event-columns">
                    {displayedEvents.length === 0 ? (
                        <p>No events available.</p>
                    ) : (
                        displayedEvents.map((event) => (
                            <Card
                                key={event.id}
                                className="event-card"
                                onClick={() => handleOpenModal(event)}
                            >
                                <Card.Body>
                                    <Card.Title className="event-title">{event.Type}</Card.Title>
                                    <Card.Text>
                                        <strong>Date:</strong> {event.Date}<br />
                                        <strong>Location:</strong> {event.Location}<br />
                                        <strong>Hats Needed:</strong> {event.HatsNeeded}<br />
                                        <strong>Address:</strong> {event.Address}<br />
                                    </Card.Text>
                                    <p className="click-to-expand">Click to expand</p>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <Modal show={isModalOpen} onHide={handleCloseModal} centered>
                <Modal.Body>
                    {selectedEvent && (
                        <div className="modal-content-container">
                            <h5 className='event-title'>{selectedEvent.Type}</h5>
                            <div className="modal-text-content">
                                <p><strong>Date:</strong> {selectedEvent.Date}</p>
                                <p><strong>Location:</strong> {selectedEvent.Location}</p>
                                <p><strong>Address:</strong> {selectedEvent.Street}, {selectedEvent.City}, {selectedEvent.State} {selectedEvent.Zip}</p>
                                <p><strong>Hats Needed:</strong> {selectedEvent.HatsNeeded}</p>
                                <p><strong>Volunteer Responsibilities:</strong> {selectedEvent.VolunteerResponsibilities}</p>

                                <div className="volunteer-list">
                                    <h6 style={{ fontWeight: 'bold' }}>RSVP'ed Volunteers:</h6>
                                    {(selectedEvent.CurrentVolunteers && selectedEvent.CurrentVolunteers.length > 0) ? (
                                        <ul>
                                            {selectedEvent.CurrentVolunteers.map((volunteer, index) => (
                                                <li key={index}>{volunteer.username}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No volunteers have RSVP'ed yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EventsPage;
