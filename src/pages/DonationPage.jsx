import React, { useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { Modal, Card, Spinner } from 'react-bootstrap';
import { useDbData } from '../utilities/firebase';
import './DonationPage.css';

const DonationPage = () => {
    const [donations, donationsError] = useDbData('donations');
    const [users] = useDbData('users');
    const [selectedCategory, setSelectedCategory] = useState('Knitted Hats');
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [donorDetails, setDonorDetails] = useState(null);

    const donationItemTypes = ['Knitted Hats', 'Unused Hats', 'Second-Hand Hats', 'Money'];

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

    // Group donations by their DonationItem
    const groupedDonations = donationItemTypes.reduce((acc, type) => {
        acc[type] = Object.keys(donations)
            .map((key) => ({ id: key, ...donations[key] }))
            .filter((donation) => donation.received && donation.DonationItem === type);
        return acc;
    }, {});

    const handleToggleChange = (value) => setSelectedCategory(value);

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

    const displayedDonations = groupedDonations[selectedCategory] || [];

    return (
        <div className="page-container box-gap">
            <div className="box">
                <div className="box-content">
                    <div>
                        <div className="admin-inbox">Donations</div>
                        <div className="sub-title">Review donations</div>
                        <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" className="wishlist-link">
                            View your Amazon Wishlist
                        </a>
                    </div>
                    <ToggleButtonGroup
                        type="radio"
                        name="categories"
                        value={selectedCategory}
                        onChange={handleToggleChange}
                        className="toggle-button-group"
                    >
                        {donationItemTypes.map((category) => (
                            <ToggleButton
                                key={category}
                                id={`tbg-radio-${category}`}
                                value={category}
                                className="d-flex align-items-center"
                            >
                                {category}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </div>
            </div>

            <div className="donationsList">
                <div className="donation-columns">
                    {displayedDonations.length === 0 ? (
                        <p>No donations available in this category.</p>
                    ) : (
                        displayedDonations.map((donation) => (
                            <Card
                                key={donation.id}
                                className="donation-card"
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
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <Modal show={isModalOpen} onHide={handleCloseModal} centered>
                <Modal.Body>
                    {selectedDonation && (
                        <div className="modal-content-container">
                            <h5 className='donation-title'>{selectedDonation.DonationItem}</h5>
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
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DonationPage;
