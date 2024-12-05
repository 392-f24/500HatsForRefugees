import React, { useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import "./InboxPage.css"
import ImageRequests from '../components/ImageRequests';
import EventRequests from '../components/EventRequests';
import VolunteerRequests from '../components/VolunteerRequests';
import { Badge } from 'react-bootstrap';
import { useDbData } from '../utilities/firebase'; // Import the useDbData hook


const InboxPage = () => {
    const [images, imagesError] = useDbData('submissions'); // Fetch images from Firebase Realtime Database
    const [events] = useDbData('events');
    const [selectedOption, setSelectedOption] = useState(1); // State for the selected toggle

    const handleToggleChange = (value) => {
        setSelectedOption(value); // Update state when toggle changes
    };

    // Handle errors if fetching images fails
    if (imagesError) {
        console.error("Error fetching images:", imagesError);
        return <div>Error loading images. Please try again later.</div>;
    }

    const falseStatusCount = images ? Object.keys(images)
        .map(key => images[key])
        .filter(image => image.status === false).length : 0;

    const pendingEventsCount = events
        ? Object.keys(events)
            .map(key => events[key])
            .filter(event => event.EventStatus === 'pending').length
        : 0;

    const unseenVolunteersCount = events
        ? Object.keys(events)
            .map((key) => events[key])
            .filter((event) => event.EventStatus === 'accepted')
            .flatMap((event) => event.CurrentVolunteers || [])
            .filter((volunteer) => !volunteer.seen).length
        : 0;


    return (
        <div className="page-container box-gap">
            <div className="box">
                <div className="box-content">
                    <div>
                        <div className="admin-inbox">Admin Inbox</div>
                        <div className="sub-title">See and manage incoming requests</div>
                    </div>
                    <ToggleButtonGroup
                        type="radio"
                        name="options"
                        value={selectedOption} // Controlled value
                        onChange={handleToggleChange} // Handle change
                        className="toggle-button-group"
                    >
                        <ToggleButton id="tbg-radio-1" value={1} className="d-flex align-items-center">
                            images
                            {falseStatusCount > 0 && <Badge bg="danger" className='ms-2'>{falseStatusCount}</Badge>}
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-2" value={2} className="d-flex align-items-center">
                            events
                            {pendingEventsCount > 0 && <Badge bg="danger" className='ms-2'>{pendingEventsCount}</Badge>}
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-3" value={3}>
                            donations
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-4" value={4} className="d-flex align-items-center">
                            volunteers
                            {unseenVolunteersCount > 0 && <Badge bg="danger" className="ms-2">{unseenVolunteersCount}</Badge>}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
            {/* Conditionally render the ImageRequests component */}
            {selectedOption === 1 && <ImageRequests images={images} />}
            {selectedOption === 2 && <EventRequests events={events} />}
            {selectedOption === 4 && <VolunteerRequests events={events} />}
        </div>
    );
}
export default InboxPage