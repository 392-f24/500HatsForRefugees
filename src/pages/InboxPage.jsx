import React, { useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import "./InboxPage.css"
import ImageRequests from '../components/ImageRequests';
import { Badge } from 'react-bootstrap';
import { useDbData } from '../utilities/firebase'; // Import the useDbData hook


const InboxPage = () => {
    const [images, imagesError] = useDbData('submissions'); // Fetch images from Firebase Realtime Database
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
                        <ToggleButton id="tbg-radio-2" value={2}>
                            events
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-3" value={3}>
                            volunteers
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
            {/* Conditionally render the ImageRequests component */}
            {selectedOption === 1 && <ImageRequests images={images}/>}
        </div>
    );
}
export default InboxPage