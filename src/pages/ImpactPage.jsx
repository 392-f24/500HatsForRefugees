
import React, { useState } from 'react';
import "./ImpactPage.css"; // Make sure to import your stylesheet
import Gallery from "../components/Gallery";
import { Button } from "react-bootstrap";
import SubmitPhotoModal from '../components/SubmitPhotoModal';


const ImpactPage = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className="page-container">
      <div>
        <h1 className="impact-title">Our Impact in Pictures</h1>
      </div>
      <div>
        <Gallery/>
      </div>
      <div className="feature-photo-section">
        <h5 className="feature-photo-heading">Have an image you would like to have featured here?</h5>
        <Button className="feature-photo-button" 
        onClick={() => setModalShow(true)}>
          Send Your Photo Here
        </Button>
    </div>
    {/* SubmitPhotoModal is shown when the button is clicked */}
      <SubmitPhotoModal
                show={modalShow}
                handleClose={() => setModalShow(false)}
            />
    </div>
  );
};

export default ImpactPage;
