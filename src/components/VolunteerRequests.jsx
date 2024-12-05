import React from 'react';
import { useDbUpdate } from '../utilities/firebase';
import { Spinner, Card, Button } from 'react-bootstrap';
import './VolunteerRequests.css';

const VolunteerRequests = ({ events }) => {
    const [updateData] = useDbUpdate();

    if (!events) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading volunteers...</span>
                </Spinner>
                <p>Loading volunteers...</p>
            </div>
        );
    }

    // Extract volunteers from accepted events
    const volunteers = Object.keys(events)
        .map((key) => ({ ...events[key], eventId: key }))
        .filter((event) => event.EventStatus === 'accepted')
        .flatMap((event) =>
            (event.CurrentVolunteers || []).map((volunteer) => ({
                ...volunteer,
                eventId: event.eventId,
                eventType: event.Type,
                eventDate: event.Date,
                eventLocation: event.Location
            }))
        )
        .sort((a, b) => a.seen - b.seen);
    
    // console.log(volunteers)

    // Mark volunteer as seen
    const handleMarkAsSeen = (volunteer) => {
        const eventKey = volunteer.eventId;
        const volunteerIndex = events[eventKey].CurrentVolunteers.findIndex(
            (v) => v.id === volunteer.id
        );
        if (volunteerIndex !== -1) {
            const volunteerPath = `events/${eventKey}/CurrentVolunteers/${volunteerIndex}/seen`;
            updateData({ [volunteerPath]: true });
        }
    };

    return (
        <div className="volunteer-requests">
            <div className="volunteer-columns">
                {volunteers.map((volunteer) => (
                    <Card
                        key={`${volunteer.eventId}-${volunteer.id}`}
                        className={`volunteer-card ${!volunteer.seen ? 'unseen' : 'greyed-out'}`}
                    >
                        <Card.Body>
                            <Card.Title>{volunteer.username}</Card.Title>
                            <Card.Text>
                                <strong>Event:</strong> {volunteer.eventType}<br />
                                <strong>Date:</strong> {volunteer.eventDate}<br />
                                <strong>Location:</strong> {volunteer.eventLocation}<br />
                            </Card.Text>
                            {!volunteer.seen && (
                                <div className="seen-button-container">
                                <Button
                                    className="mark-as-seen-button"
                                    onClick={() => handleMarkAsSeen(volunteer)}
                                >
                                    <i className="bi bi-check-circle-fill"></i> Mark as Seen
                                </Button>
                                </div>
                            )}

                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default VolunteerRequests;
