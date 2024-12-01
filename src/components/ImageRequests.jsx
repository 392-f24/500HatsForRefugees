import { useDbUpdate } from '../utilities/firebase'; // Import the useDbData hook
import { Spinner, Card, Row, Col, Modal, Button } from 'react-bootstrap'; // Import additional Bootstrap components
import { useState } from 'react';
import './ImageRequests.css'
const ImageRequests = ({images}) => {
    // const [images, imagesError] = useDbData('submissions'); // Fetch images from Firebase Realtime Database
    const [updateData] = useDbUpdate(); // Use the update hook
    const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility
    const [selectedImage, setSelectedImage] = useState(null); // State to track selected image

    // Handle errors if fetching images fails
    // if (imagesError) {
    //     console.error("Error fetching images:", imagesError);
    //     return <div>Error loading images. Please try again later.</div>;
    // }

    if (!images) {
        return (
          <div className="loading-container">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p>Loading images...</p>
          </div>
        );
    }

    const visibleImages = Object.keys(images)
        .map(key => images[key])
        .sort((a, b) => a.status - b.status); // Sort images by status

    const handleOpenModal = (image) => {
        setSelectedImage(image); // Set the selected image details
        setIsModalOpen(true); // Open the modal
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
        setSelectedImage(null); // Clear the selected image
    };
    
    const handleStatusChange = (value) => {
        if (!selectedImage) return;

        const statusPath = `submissions/${selectedImage.timestamp}/status`;
        // Update the status to true in the database
        try {
            updateData({[statusPath]: value });
            console.log(`Updated data at: ${statusPath}`);

        } catch(error) {
            console.error(`Failed to update data at: ${statusPath}`, error);

        }
        handleCloseModal(); // Close the modal
    };

    const handleReject = async() => {
        if (!selectedImage) return;

        // Show confirmation alert before deleting
        const confirmDelete = window.confirm('Are you sure you want to reject this submission?');
        if (confirmDelete) {
            const statusPath = `submissions/${selectedImage.timestamp}`;
            console.log(statusPath)
            try {
                updateData({[statusPath]:null});
                console.log(`Deleted data at: ${statusPath}`);
            } catch (error) {
                console.error(`Failed to delete data at: ${statusPath}`, error);
            }
    
            handleCloseModal(); // Close the main modal
        }
    };


    return (
        <div>
            <div className="image-requests">Image Upload Requests: </div>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4"> {/* Responsive grid layout */}
                {visibleImages.map((entry) => (
                    <Col key={entry.timestamp}> {/* Use unique key for each item */}
                        <Card
                            className={`image-card ${entry.status ? 'greyed-out' : ''}`}
                            onClick={() => handleOpenModal(entry)}
                        >
                            <Card.Body>
                                    <img
                                        src={entry.imageUrl} 
                                        alt="top"
                                        className="image-container" 
                                    />
                                <Card.Text className="expand">click to expand</Card.Text>
                            </Card.Body>
                        </Card>

                        {/* Modal for showing image details */}
                        <Modal
                            show={isModalOpen}
                            onHide={handleCloseModal}
                            centered
                            dialogClassName="image-popup-modal"
                        >
                            <Modal.Body>
                                {selectedImage && (
                                    <div className="modal-content-container">
                                        <div className="image-details">
                                            <h5>{selectedImage.name}</h5>
                                            <p><strong>Date:</strong> {new Date(selectedImage.timestamp).toLocaleString()}</p>
                                            <p><strong>Location:</strong> {selectedImage.town}, {selectedImage.state}</p>
                                            <p><strong>Message:</strong> {selectedImage.message}</p>
                                        </div>
                                        <img
                                            src={selectedImage.imageUrl}
                                            alt="Selected"
                                            className="enlarged-image"
                                        />
                                        <div className="bottom-buttons">
                                            {!selectedImage.status && <Button className="yellow-btn" onClick={handleReject}>Reject</Button>}
                                            {!selectedImage.status && <Button className="yellow-btn" onClick={()=>handleStatusChange(true)}>Accept</Button>}
                                            {selectedImage.status && <Button className="yellow-btn" onClick={()=>handleStatusChange(false)}>Withdraw</Button>}
                                        </div>

                                    </div>
                                )}
                            </Modal.Body>
                        </Modal>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
export default ImageRequests