import React, { useState, useEffect, useRef } from 'react';

import { Container, Row, Col, Modal, Spinner } from 'react-bootstrap';
import { useDbData } from '../utilities/firebase'; // Import the useDbData hook
import './Gallery.css'; // For custom styles

const Gallery = () => {
    // const [images, setImages] = useState(null);
    const [isAnimating, setIsAnimating] = useState(true); // State to track if animation is running
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [selectedImage, setSelectedImage] = useState(null); // Track clicked image
    const [pausedOffset, setPausedOffset] = useState(0); // To track current animation position
    const galleryRef = useRef(null); // Ref for the gallery

  
    const imagesPerRow = 3; // 3 images per row

    const [images, imagesError] = useDbData('submissions'); // Fetch images from Firebase Realtime Database
    console.log(images)
    useEffect(() => {
        if (galleryRef.current) {
            const galleryWidth = galleryRef.current.scrollWidth; // Total width of the gallery
            const speed = 10; // Desired speed in pixels per second
            const duration = galleryWidth / speed; // Calculate duration based on speed

            // Set CSS variable for animation duration
            galleryRef.current.style.setProperty('--animation-duration', `${duration}s`);

        }
    }, images); // Only re-run the effect if `images` changes (i.e., after data is fetched)

  // Handle errors if fetching images fails
    if (imagesError) {
        console.error("Error fetching images:", imagesError);
        return <div>Error loading images. Please try again later.</div>;
    }

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

    const totalRows = Math.ceil(Object.keys(images).length / imagesPerRow);

    const visibleImages = Object.keys(images).map(key => images[key]);

    // Function to stop animation when an image is clicked
    const handleImageClick = (image) => {
        setSelectedImage(image);
        setIsModalOpen(true); // Open modal

        const gallery = galleryRef.current;

      const computedStyle = window.getComputedStyle(gallery);
      const matrix = computedStyle.transform || "matrix(1, 0, 0, 1, 0, 0)";
      const translateX = matrix.match(/matrix.*\((.+)\)/)[1].split(", ")[4]; // Extract X offset
      setPausedOffset(parseFloat(translateX)); // Save the current offset
      gallery.style.animationPlayState = "paused";

    setIsAnimating(!isAnimating); // Toggle animation
  };
    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        const gallery = galleryRef.current;
        gallery.style.transform = `translateX(${pausedOffset}px)`;
        gallery.style.animationPlayState = "running";
        setIsAnimating(!isAnimating);
    };
     
  return (
    <Container className="gallery-container">
      <Row className="justify-content-center">
        <Col md={10}>
        <div
            ref={galleryRef}
            className="image-gallery"
            style={{
              animationPlayState: isAnimating ? "running" : "paused",
            }}
          >
            {Array.from({ length: totalRows }).map((_, rowIndex) => (
              <div key={rowIndex} className="image-row">
                {visibleImages.slice(rowIndex * imagesPerRow, (rowIndex + 1) * imagesPerRow).map((image, imageIndex) => (
                  <div className="gallery-image-container" key={imageIndex} onClick={() => handleImageClick(image)}>
                    <img src={image.imageUrl}
                    alt={`gallery-image-${imageIndex}`}
                    className="gallery-image" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Col>
      </Row>
      {/* Modal for Enlarged Image */}
      <Modal
        show={isModalOpen}
        onHide={handleCloseModal}
        centered
        dialogClassName="image-popup-modal"
      >
        <Modal.Body>
        {selectedImage && <div className="modal-content-container">
          <div className="image-details">
            <h5>{selectedImage.name}</h5>
            <p><strong>Date:</strong> {(Date(selectedImage.timestamp))}</p>
            <p><strong>Location:</strong> {selectedImage.town}, {selectedImage.state}</p>
            <p><strong>Message:</strong> {selectedImage.message}</p>
          </div>
          <img
            src={selectedImage?.imageUrl} 
            alt="Selected"
            className="enlarged-image"
          />
         
        </div>}
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default Gallery;
