import React, { useState } from 'react';
import './AddEvent.css';
import { useDbUpdate, useAuthState } from '../utilities/firebase';

const AddEvent = ({ closeModal }) => {
    if (!closeModal) return null;

    const [user] = useAuthState();

    const [eventType, setEventType] = useState('Hats and Hot Chocolate');
    const [eventStatus] = useState('pending');
    const [requesterID] = useState(user?.uid);
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    // Additional fields for "Hats and Hot Chocolate"
    const [hispanicLatino, setHispanicLatino] = useState('');
    const [asian, setAsian] = useState('');
    const [white, setWhite] = useState('');
    const [africanAmerican, setAfricanAmerican] = useState('');
    const [americanIndian, setAmericanIndian] = useState('');
    const [hatsNeeded, setHatsNeeded] = useState('');
    const [requirements, setRequirements] = useState(false);

    const [updateData] = useDbUpdate('/events');

    const handleOverlayClick = (e) => {
        if (e.target.className === 'modalBackground') {
            closeModal(false);
        }
    };

    const handleSave = async () => {
        if (!eventType || !location || !date || !startTime || !endTime) {
            console.error("Please fill in all required fields.");
            return;
        }

        // Additional validation for "Hats and Hot Chocolate" fields
        if (eventType === 'Hats and Hot Chocolate' && (!hatsNeeded || !hispanicLatino || !asian || !white || !africanAmerican || !americanIndian)) {
            console.error("Please fill in all demographic fields.");
            return;
        }

        const newEventId = Date.now().toString();
        const newEvent = {
            Type: eventType,
            EventStatus: eventStatus,
            RequesterID: "TemporaryRequesterID",
            Location: location,
            Date: date,
            Time: {
                startTime,
                endTime
            }
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
        } catch (error) {
            console.error("Error adding event:", error);
        }

        closeModal(false);
    };

    // Validation for enabling the Save button
    const isSaveDisabled = () => {
        if (!eventType || !location || !date || !startTime || !endTime) return true;
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

    return (
        <div className="modalBackground" onClick={handleOverlayClick}>
            <div className="modalContainer">
                <div className="title">
                    <h2>Request an Event from 500 Hats</h2>
                </div>
                <h4 className="titleSection">Logistics</h4>

                <div className="body">
                    {/* Event Type Dropdown */}
                    
                    <p className="">Event type</p>
                    <select
                        className="input fullWidth"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                    >
                       
                        <option value="Hats and Hot Chocolate">Hats and Hot Chocolate</option>
                        <option value="Hat Knitting">Hat Knitting</option>
                    </select>

                    <input
                        className="input fullWidth"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter location"
                    />
                    <input
                        className="input fullWidth"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <input
                        className="input fullWidth"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        placeholder="Start Time"
                    />
                    <input
                        className="input fullWidth"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        placeholder="End Time"
                    />

                    {/* Conditionally render additional fields for Hats and Hot Chocolate */}
                    {eventType === 'Hats and Hot Chocolate' && (
                        <>
                            <input
                                className="input fullWidth"
                                type="number"
                                value={hatsNeeded}
                                onChange={(e) => setHatsNeeded(e.target.value)}
                                placeholder="Hats Needed"
                            />
                            <input
                                className="input fullWidth"
                                type="number"
                                value={hispanicLatino}
                                onChange={(e) => setHispanicLatino(e.target.value)}
                                placeholder="Hispanic/Latino"
                            />
                            <input
                                className="input fullWidth"
                                type="number"
                                value={asian}
                                onChange={(e) => setAsian(e.target.value)}
                                placeholder="Asian"
                            />
                            <input
                                className="input fullWidth"
                                type="number"
                                value={white}
                                onChange={(e) => setWhite(e.target.value)}
                                placeholder="White"
                            />
                            <input
                                className="input fullWidth"
                                type="number"
                                value={africanAmerican}
                                onChange={(e) => setAfricanAmerican(e.target.value)}
                                placeholder="African American"
                            />
                            <input
                                className="input fullWidth"
                                type="number"
                                value={americanIndian}
                                onChange={(e) => setAmericanIndian(e.target.value)}
                                placeholder="American Indian"
                            />
                            <p className="inputSection"> Does your venue meet the requirements below:</p>
                            <p className="requirementsText"> Access to Electric Plug</p>
                            <p className="requirementsText"> Access to Drinking Water</p>
                            <p className="requirementsText"> Tables</p>
                            <p className="requirementsText"> Light</p>
                            <label className="dropdown-label">
                                <select
                                    value={requirements ? "yes" : "no"}
                                    onChange={(e) => setRequirements(e.target.value === "yes")}
                                    className="requirements-dropdown"
                                >
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>
                        </>
                    )}
                </div>

                <div className="footer">
                    <button id="cancelBtn" onClick={() => closeModal(false)}>Cancel</button>
                    <button id="saveBtn" onClick={handleSave} disabled={isSaveDisabled()}>Add Event</button>
                </div>
            </div>
        </div>
    );
};

export default AddEvent;
