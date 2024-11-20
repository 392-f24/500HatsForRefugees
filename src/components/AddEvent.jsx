// AddEvent.jsx

import React, { useState } from 'react';
import './AddEvent.css';
import { useDbUpdate, useAuthState } from '../utilities/firebase';
import { Button } from 'react-bootstrap';
const AddEvent = ({ closeModal }) => {
    if (!closeModal) return null;

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

    const handleOverlayClick = (e) => {
        if (e.target.className === 'modalBackground') {
            closeModal(false);
        }
    };

    const handleSave = async () => {
        if (!eventType || !location || !date || !startTime || !endTime || !street || !city || !state || !zip) {
            console.error("Please fill in all required fields.");
            return;
        }

        // Additional validation for "Hats and Hot Chocolate" fields
        if (eventType === 'Hats and Hot Chocolate' && (!hatsNeeded || !hispanicLatino || !asian || !white || !africanAmerican || !americanIndian)) {
            console.error("Please fill in all demographic fields.");
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
        } catch (error) {
            console.error("Error adding event:", error);
        }

        closeModal(false);
    };

    // Validation for enabling the Save button
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

    // Function to autofill the form with demo data
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
        <div className="modalBackground" onClick={handleOverlayClick}>
            <div className="modalContainer">
                <div className="title">
                    <h2>Request an Event from 500 Hats</h2>
                </div>
                <h4 className="titleSection">Logistics</h4>

                <div className="modalBody">
                    {/* Event Type Dropdown */}
                    <p className="inputSection">Event type</p>
                    <select
                        className="input fullWidth"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                    >
                        <option value="Hats and Hot Chocolate">Hats and Hot Chocolate</option>
                        <option value="Hat Knitting">Hat Knitting</option>
                    </select>

                    <p className="inputSection">Location</p>
                    <input
                        className="input fullWidth"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter location"
                    />

                    <p className="inputSection">Date</p>
                    <input
                        className="input fullWidth"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <p className="inputSection">Start Time</p>
                    <input
                        className="input fullWidth"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        placeholder="Start Time"
                    />

                    <p className="inputSection">End Time</p>
                    <input
                        className="input fullWidth"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        placeholder="End Time"
                    />

                    {/* Address Fields */}
                    <p className="inputSection">Street</p>
                    <input
                        className="input fullWidth"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Enter street"
                    />

                    <p className="inputSection">City</p>
                    <input
                        className="input fullWidth"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city"
                    />

                    <p className="inputSection">State</p>
                    <input
                        className="input fullWidth"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Enter state"
                    />

                    <p className="inputSection">Zip Code</p>
                    <input
                        className="input fullWidth"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="Enter zip code"
                    />

                    {/* Conditionally render additional fields for Hats and Hot Chocolate */}
                    {eventType === 'Hats and Hot Chocolate' && (
                        <>
                            <h4 className="titleSection">Hats & Hot Chocolate</h4>
                            <p className="inputSection">Around How many hats are needed?</p>
                            <input
                                className="input fullWidth"
                                type="number"
                                value={hatsNeeded}
                                onChange={(e) => setHatsNeeded(e.target.value)}
                                placeholder="Hats Needed"
                            />

                            <p className="inputSection">Demographics of serving population (Enter a number for each group's percentage)</p>
                            <input
                                className="input fullWidth "
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
                        </>
                    )}
                </div>

                <div className="modalFooter">
                    <Button variant="secondary" className="yellow-btn" onClick={handleSave} disabled={isSaveDisabled()}>
                        Save
                    </Button>
                    <Button variant="secondary" className="yellow-btn" onClick={() => closeModal(false)}>
                        Cancel
                    </Button>
                    <button className="demoButton" onClick={autofillDemoData}>
                        Autofill Demo Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEvent;