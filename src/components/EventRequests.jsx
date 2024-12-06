import React, { useState } from 'react';
import { useDbUpdate, useDbRemove } from '../utilities/firebase';
import { Spinner, Card, Row, Col, Modal, Button } from 'react-bootstrap';
import './EventRequests.css';

const EventRequests = ({ events }) => {
    const [updateData] = useDbUpdate();
    const [removeData] = useDbRemove();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
    const [volunteerNum, setVolunteerNum] = useState(0);
    const [responsibilities, setResponsibilities] = useState([]);

    const [newResponsibility, setNewResponsibility] = useState("");

    const handleAddResponsibility = () => {
        if (newResponsibility.trim() !== "") {
          setResponsibilities([...responsibilities, newResponsibility.trim()]);
          setNewResponsibility(""); // Clear input field
        }
      };
    
    const handleRemoveResponsibility = (index) => {
        const updatedResponsibilities = responsibilities.filter((_, i) => i !== index);
        setResponsibilities(updatedResponsibilities);
      };

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

    const sortedEvents = Object.keys(events)
        .map((key) => ({ id: key, ...events[key] }))
        .sort((a, b) => {
            const statusOrder = { pending: 0, accepted: 1 };
            return (statusOrder[a.EventStatus] ?? 2) - (statusOrder[b.EventStatus] ?? 2);
        });

    const handleOpenModal = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = (clearSelection = true) => {
        setIsModalOpen(false);
        if (clearSelection) {
            setSelectedEvent(null);
        }
    };

    const handleAccept = () => {
        if (!selectedEvent) return;
        setIsVolunteerModalOpen(true);
        handleCloseModal(false);
    };

    const handleFinalAccept = async () => {
        if (!selectedEvent) return;
        try {
            await updateData({
                [`events/${selectedEvent.id}/EventStatus`]: 'accepted',
                [`events/${selectedEvent.id}/CurrentVolunteers`]: [],
                [`events/${selectedEvent.id}/MaxVolunteerNum`]: volunteerNum,
                [`events/${selectedEvent.id}/CurrentVolunteerNum`]: 0,
                [`events/${selectedEvent.id}/VolunteerResponsibilities`]: responsibilities, // Store as array
            });
            console.log(`Event ${selectedEvent.id} updated successfully!`);
        } catch (error) {
            console.error('Error updating event:', error);
        }
        setIsVolunteerModalOpen(false);
        setSelectedEvent(null);
        setVolunteerNum(0);
        setResponsibilities([]);
    };
    


    const handleWithdraw = async () => {
        if (!selectedEvent) return;
        try {
            await updateData({ [`events/${selectedEvent.id}/EventStatus`]: 'pending' });
        } catch (error) {
            console.error('Error withdrawing event:', error);
        }
        handleCloseModal();
    };

    const handleReject = async () => {
        if (!selectedEvent) return;
        if (window.confirm('Are you sure you want to reject this event?')) {
            try {
                await removeData(`events/${selectedEvent.id}`);
            } catch (error) {
                console.error('Error rejecting event:', error);
            }
            handleCloseModal();
        }
    };

    return (
        <div className="eventsList">
            <div className="event-columns">
                {sortedEvents.map((event) => (
                    <Card
                        key={event.id}
                        className={`event-card ${event.EventStatus === 'accepted' ? 'greyed-out' : ''}`}
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
                            <div className="status-badge-container">
                                <div className="status-badge">
                                    <span className={`badge ${event.EventStatus === 'pending' ? 'pending' : 'accepted'}`}>
                                        {event.EventStatus}
                                    </span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            <Modal show={isModalOpen} onHide={handleCloseModal} centered dialogClassName="event-popup-modal">
                <Modal.Body>
                    {selectedEvent && (
                        <div className="modal-content-container">
                            <h5 className='event-title'>{selectedEvent.Type}</h5>
                            <div className="modal-text-content">
                                <p><strong>Date:</strong> {selectedEvent.Date}</p>
                                <p><strong>Location:</strong> {selectedEvent.Location}</p>
                                <p><strong>Address:</strong> {selectedEvent.Street}, {selectedEvent.City}, {selectedEvent.State} {selectedEvent.Zip}</p>
                                <p><strong>Hats Needed:</strong> {selectedEvent.HatsNeeded}</p>
                                <p><strong>Status:</strong> {selectedEvent.EventStatus}</p>

                                <div className="demographics-section">
                                    <h6>Demographics:</h6>
                                    {selectedEvent.Demographics && (
                                        <ul>
                                            {Object.entries(selectedEvent.Demographics).map(([group, percentage]) => (
                                                <li key={group}>
                                                    <strong>{group}:</strong> {percentage}%
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="bottom-buttons">
                                {selectedEvent.EventStatus === 'pending' && (
                                    <div className="yellow-btn-group">
                                        <Button className="yellow-btn" onClick={handleAccept}>
                                            Accept
                                        </Button>
                                        <Button className="yellow-btn" onClick={handleReject}>
                                            Reject
                                        </Button>
                                    </div>
                                )}
                                {selectedEvent.EventStatus === 'accepted' && (
                                    <Button className="yellow-btn" onClick={handleWithdraw}>
                                        Withdraw
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={isVolunteerModalOpen} onHide={() => setIsVolunteerModalOpen(false)} centered dialogClassName="volunteer-popup-modal">
                <Modal.Body>
                    <div className="modal-content-container">
                        <h5 className='event-title'>Specify Volunteer Details</h5>
                        <div className="modal-text-content">
                            <p><strong>Event:</strong> {selectedEvent?.Type}</p>
                            <p><strong>Date:</strong> {selectedEvent?.Date}</p>
                        </div>
                        <div>
                            <label className="input-label">Number of Volunteers Needed:</label>
                            <input
                                type="number"
                                className="input-field"
                                value={volunteerNum}
                                onChange={(e) => setVolunteerNum(e.target.value)}
                                placeholder="Enter number of volunteers"
                            />
                            <label className="input-label">Volunteer Responsibilities:</label>
                            <div className="responsibilities-list">
                            {responsibilities.map((res, index) => (
                                <div key={index} className="responsibility-item">
                                <span>{res}</span>
                                <button className="remove-btn" onClick={() => handleRemoveResponsibility(index)}>Remove</button>
                                </div>
                            ))}
                            </div>
                            <input
                            type="text"
                            className="input-field"
                            value={newResponsibility}
                            onChange={(e) => setNewResponsibility(e.target.value)}
                            placeholder="Enter a responsibility"
                            />
                            <button className="add-btn" onClick={handleAddResponsibility}>Add Another</button>

                        </div>
                        <div className="bottom-buttons">
                            <Button className="yellow-btn" onClick={handleFinalAccept}>Accept</Button>
                            <Button className="yellow-btn" onClick={() => setIsVolunteerModalOpen(false)}>Cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    );
};

export default EventRequests;