import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

const SubmitPhotoModal = ({ show, handleClose, currentUserName }) => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState(currentUserName || '');
    const [zip, setZip] = useState('');
    const [town, setTown] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handle ZIP code change
    const handleZipChange = async (e) => {
        const enteredZip = e.target.value;
        setZip(enteredZip);

        if (enteredZip.length === 5) {
            setIsLoading(true);
            try {
                const response = await fetch(`https://api.zippopotam.us/us/${enteredZip}`);
                if (response.ok) {
                    const data = await response.json();
                    setTown(data.places[0]['place name']);
                } else {
                    setTown(''); // Clear if invalid ZIP
                }
            } catch (error) {
                console.error('Error fetching town:', error);
                setTown('');
            } finally {
                setIsLoading(false);
            }
        } else {
            setTown(''); // Clear town if ZIP is incomplete
        }
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    // Handle form submission
    const handleSubmit = () => {
        console.log({ image, name, zip, town, message });
        handleClose(); // Close modal after submission
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Submit Your Photo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Image Upload */}
                    <Form.Group controlId="formFile">
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control type="file" onChange={handleImageUpload} accept="image/*" />
                    </Form.Group>

                    {/* Name Field */}
                    <Form.Group controlId="formName" className="mt-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </Form.Group>

                    {/* ZIP Field */}
                    <Form.Group controlId="formZip" className="mt-3">
                        <Form.Label>ZIP Code (Optional)</Form.Label>
                        <Form.Control
                            type="text"
                            value={zip}
                            onChange={handleZipChange}
                            placeholder="Enter ZIP Code"
                            maxLength="5"
                        />
                        {isLoading && <Spinner animation="border" size="sm" className="mt-2" />}
                        {town && <Form.Text className="text-muted mt-2">Town: {town}</Form.Text>}
                    </Form.Group>

                    {/* Message Field */}
                    <Form.Group controlId="formMessage" className="mt-3">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your message"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SubmitPhotoModal;
