
import React, { useState } from 'react';
import Gallery from "../components/Gallery";
import { Button } from "react-bootstrap";
import SubmitPhotoModal from '../components/SubmitPhotoModal';

import "./ImpactPage.css"; // Make sure to import your stylesheet
//auth 
import { useAuthState } from '../utilities/firebase';
import { useNavigate } from 'react-router-dom';

const ImpactPage = () => {
  const [modalShow, setModalShow] = useState(false);
  //auth 
  const [user] = useAuthState(); 
  const navigate = useNavigate(); 
  const handleSendPhotoClick = () => {
    if (!user) {
      navigate('/login'); // Redirect to login if unauthorized
    } else {
      setModalShow(true); // Show the photo submission modal if authorized
    }
  };

  return (
    <div className="page-container">
      <div>
        <h1 className="impact-title">Our Impact in Pictures</h1>
        <p class="quote">
          "It is an incredible thing to create a piece of art for someone you will likely never meet" 
          <span class="author">- Margie Chan (founder of 500 Hats for Refugees)</span>
        </p>
      </div>
      <div>
        <Gallery/>
      </div>
      <div className="feature-photo-section">
        <h5 className="feature-photo-heading">Have an image you would like to have featured here?</h5>
        <Button className="yellow-btn" onClick={handleSendPhotoClick}>
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
