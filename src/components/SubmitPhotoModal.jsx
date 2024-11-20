import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { uploadImage, submitDataToDatabase } from '../utilities/firebase'; // Import Firebase functions

import './SubmitPhotoModal.css'

const SubmitPhotoModal = ({ show, handleClose }) => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [zip, setZip] = useState('');
    const [town, setTown] = useState('');
    const [state, setState] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: false,
        image: false,
    });

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
                    setState(data.places[0]['state abbreviation']);
                } else {
                    setTown(''); // Clear if invalid ZIP
                }
            } catch (error) {
                console.error('Error fetching town:', error);
                setTown('');
                setState('');
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

    // Form validation
    const validateForm = () => {
        let valid = true;
        let newErrors = { name: false, image: false };

        if (name === '') {
            newErrors.name = true;
            valid = false;
        }

        if (!image) {
            newErrors.image = true;
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (validateForm()) {
            setIsLoading(true);
            console.log('Submitting data...');

            try {
                // Upload image to Firebase Storage
                const imageUrl = await uploadImage(image);

                // Prepare data for Firebase Realtime Database
                const data = {
                    name,
                    zip,
                    town,
                    state,
                    message,
                    imageUrl,
                    timestamp: Date.now(),
                };

                // Submit data to Firebase Realtime Database
                await submitDataToDatabase(data);

                console.log('Data submitted:', data);
                handleClose(); // Close modal after submission
            } catch (error) {
                console.error('Error during submission:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered className="submit-photo-modal">
            <Modal.Header closeButton className="modal-header">
                <Modal.Title>Submit Your Photo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Image Upload */}
                    <Form.Group controlId="formFile">
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control type="file" onChange={handleImageUpload} 
                        accept="image/*" 
                        isInvalid={errors.image}
                        className="custom-input"/>
                        <Form.Control.Feedback type="invalid">
                            Please upload an image.
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Name Field */}
                    <Form.Group controlId="formName" className="mt-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            isInvalid={errors.name}
                            className="custom-input"
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter your name.
                        </Form.Control.Feedback>
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
                            className="custom-input"
                        />
                        {isLoading && <Spinner animation="border" size="sm" className="mt-2" />}
                        {town && <Form.Text className="text-muted mt-2">Town: {town}, State: {state}</Form.Text>}
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
                            className="custom-input"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
                <Button variant="secondary" onClick={handleClose} className="black-btn">
                    Cancel
                </Button>
                <Button variant="secondary" onClick={handleSubmit} className="white-btn">
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SubmitPhotoModal;