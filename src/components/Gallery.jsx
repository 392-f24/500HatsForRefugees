import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import './Gallery.css'; // For custom styles
const images = [
    "/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg", "/images/image4.jpg",
    "/images/image5.jpg", "/images/image6.jpg", "/images/image7.jpg", "/images/image8.jpg",
    "/images/image9.jpg", "/images/image10.jpg", "/images/image11.jpg", "/images/image12.jpg",
    "/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg", "/images/image4.jpg",
    "/images/image5.jpg", "/images/image6.jpg", "/images/image7.jpg", "/images/image8.jpg",
    "/images/image9.jpg", "/images/image10.jpg", "/images/image11.jpg", "/images/image12.jpg"
  ];
const Gallery = () => {
    const [isAnimating, setIsAnimating] = useState(true); // State to track if animation is running
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [selectedImage, setSelectedImage] = useState(null); // Track clicked image

    const [pausedOffset, setPausedOffset] = useState(0); // To track current animation position
    const galleryRef = useRef(null); // Ref for the gallery

  
    const imagesPerRow = 3; // 3 images per row
    const totalRows = Math.ceil(images.length / imagesPerRow); // Calculate rows based on image count
    // const imagesPerPage = imagesPerRow * totalRows; // 12 images per page

    const visibleImages = images;
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
                    <img
                      src={image}
                      alt={`gallery-image-${imageIndex}`}
                      className="gallery-image"
                    />
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
        <div className="modal-content-container">
          <div className="image-details">
            <h5>NAME{/*{selectedImage.name}*/}</h5>
            <p><strong>Date:</strong> {/*{selectedImage.date}*/}</p>
            <p><strong>Location:</strong> {/*{selectedImage.location}*/}</p>
            <p><strong>Message:</strong> {/*{selectedImage.message}*/}</p>
          </div>
          <img
            src={selectedImage}
            alt="Selected"
            className="enlarged-image"
          />
         
        </div>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default Gallery;
