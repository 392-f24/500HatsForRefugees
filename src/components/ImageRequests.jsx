import { useDbData } from '../utilities/firebase'; // Import the useDbData hook
import { Spinner, Card, Row, Col } from 'react-bootstrap'; // Import additional Bootstrap components
import './ImageRequests.css'
const ImageRequests = () => {
    const [images, imagesError] = useDbData('submissions'); // Fetch images from Firebase Realtime Database

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
    console.log(images);
    const visibleImages = Object.keys(images).map(key => images[key]);
    console.log(visibleImages);
    return (
        <div>
            <div className="image-requests">Image Upload Requests: </div>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4"> {/* Responsive grid layout */}
                {visibleImages.map((entry) => (
                    <Col key={entry.timestamp}> {/* Use unique key for each item */}
                        <Card className="image-card">
                            <Card.Body>
                                    <img
                                        src={entry.imageUrl} 
                                        alt="top"
                                        className="image-container" 
                                    />
                                <Card.Text className="expand">click to expand</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
export default ImageRequests