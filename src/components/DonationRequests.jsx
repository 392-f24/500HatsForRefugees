import React, { useState } from 'react';
import { useDbUpdate, useDbData } from '../utilities/firebase';
import { Spinner, Card, Modal, Button } from 'react-bootstrap';
import './DonationRequests.css';
import './EventRequests.css';

const DonationRequests = ({ donations }) => {
    const [updateData] = useDbUpdate();
    const [users] = useDbData('users');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [donorDetails, setDonorDetails] = useState(null);

    if (!donations) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Loading donations...</p>
            </div>
        );
    }

    const sortedDonations = Object.keys(donations)
        .map((key) => ({ id: key, ...donations[key] }))
        .sort((a, b) => a.received - b.received);

    const handleOpenModal = (donation) => {
        setSelectedDonation(donation);
        if (donation.DonorID !== "Anonymous" && users) {
            const user = users[donation.DonorID];
            setDonorDetails(user ? { username: user.username, email: user.email } : null);
        } else {
            setDonorDetails(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDonation(null);
        setDonorDetails(null);
    };

    const handleMarkReceived = async () => {
        if (!selectedDonation) return;
        try {
            await updateData({ [`donations/${selectedDonation.id}/received`]: true });
            handleCloseModal();
        } catch (error) {
            console.error('Error marking donation as received:', error);
        }
    };

    const handleMarkNotReceived = async () => {
        if (!selectedDonation) return;
        try {
            await updateData({ [`donations/${selectedDonation.id}/received`]: false });
            handleCloseModal();
        } catch (error) {
            console.error('Error marking donation as not received:', error);
        }
    };

    return (
        <div className="donation-requests">
            <div className="donation-columns">
                {sortedDonations.map((donation) => (
                    <Card
                        key={donation.id}
                        className={`donation-card ${donation.received ? 'greyed-out' : ''}`}
                        onClick={() => handleOpenModal(donation)}
                    >
                        <Card.Body>
                            <Card.Title className="donation-title">{donation.DonationItem}</Card.Title>
                            <Card.Text>
                                <strong>Mode:</strong> {donation.DonationMode}<br />
                                <strong>Donor:</strong> {donation.DonorID === "Anonymous" ? "Anonymous" : "View Details"}<br />
                                <strong>Location:</strong> {donation.LocationOfDonor}
                            </Card.Text>
                            <p className="click-to-expand">Click to expand</p>
                            <div className="status-badge-container">
                                <div className="status-badge">
                                    <span
                                        className={`badge ${donation.received ? 'received' : 'not-received'
                                            }`}
                                    >
                                        {donation.received ? 'Received' : 'Not Received'}
                                    </span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            <Modal show={isModalOpen} onHide={handleCloseModal} centered dialogClassName="event-popup-modal">
                <Modal.Body>
                    {selectedDonation && (
                        <div className="modal-content-container">
                            <h5 className='event-title'>{selectedDonation.DonationItem}</h5>
                            <div className="modal-text-content">
                                <p><strong>Mode:</strong> {selectedDonation.DonationMode}</p>
                                <p>
                                    <strong>Donor:</strong>{" "}
                                    {selectedDonation.DonorID === "Anonymous" ? (
                                        "Anonymous"
                                    ) : donorDetails ? (
                                        <>
                                            {donorDetails.username} ({donorDetails.email})
                                        </>
                                    ) : (
                                        "Loading..."
                                    )}
                                </p>
                                <p><strong>Location:</strong> {selectedDonation.LocationOfDonor}</p>
                                {selectedDonation.MonetaryAmt && (
                                    <p><strong>Amount:</strong> ${selectedDonation.MonetaryAmt}</p>
                                )}
                                {selectedDonation.HatQuantity && (
                                    <p><strong>Hats:</strong> {selectedDonation.HatQuantity}</p>
                                )}
                            </div>
                            <div className="bottom-buttons">
                                <div className="yellow-btn-group">
                                    {!selectedDonation.received && (
                                        <Button className="yellow-btn-2" onClick={handleMarkReceived}>
                                            Received
                                        </Button>
                                    )}
                                    <Button className="yellow-btn-2" onClick={handleMarkNotReceived}>
                                        Not Received
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DonationRequests;
