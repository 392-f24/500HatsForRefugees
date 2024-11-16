// Navigationbar.jsx

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import headerIcon from '../../public/headerIcon.svg'; 

const LandingPageLink = ({ isSelected, onClick }) => {
  return (
    <NavLink to="/" className="nav-item" onClick={onClick}>
      <p className={`navText ${isSelected ? 'active-link' : ''}`}>Our Work</p>
    </NavLink>
  );
};

const ImpactPageLink = ({ isSelected, onClick }) => {
  return (
    <NavLink to="/impact" className="nav-item" onClick={onClick}>
      <p className={`navText ${isSelected ? 'active-link' : ''}`}>Get Involved</p>
    </NavLink>
  );
};

const VolunteerOpportunitiesLink = ({ isSelected, onClick }) => {
  return (
    <NavLink to="/volunteerOpportunities" className="nav-item" onClick={onClick}>
      <p className={`navText ${isSelected ? 'active-link' : ''}`}>Our Team</p>
    </NavLink>
  );
};

const LoginLink = ({ isSelected, onClick }) => {
  return (
    <NavLink to="/login" className="nav-item login-btn" onClick={onClick}>
      <p className={`navText ${isSelected ? 'active-link' : ''}`}>LOG IN</p>
    </NavLink>
  );
};

const SignUpLink = ({ isSelected, onClick }) => {
  return (
    <NavLink to="/signUp" className="nav-item sign-up" onClick={onClick}>
      <p className={`navText ${isSelected ? 'active-link' : ''}`}>SIGN UP</p>
    </NavLink>
  );
};

const Navigationbar = () => {
  const [selectedLink, setSelectedLink] = useState('');

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand href="/" className="brand-logo">
          <img src={headerIcon} alt="Logo" className="header-icon" />
          <div className="brand-text-container">
            <span className="brand-text">500HatsForRefugees</span>
            <span className="brand-subtext">Chicago, IL</span>
          </div>
        </Navbar.Brand>
        <Nav className="ml-auto nav-links">
          <LandingPageLink
            isSelected={selectedLink === 'landing'}
            onClick={() => setSelectedLink('landing')}
          />
          <ImpactPageLink
            isSelected={selectedLink === 'impact'}
            onClick={() => setSelectedLink('impact')}
          />
          <VolunteerOpportunitiesLink
            isSelected={selectedLink === 'volunteer'}
            onClick={() => setSelectedLink('volunteer')}
          />
          <LoginLink
            isSelected={selectedLink === 'login'}
            onClick={() => setSelectedLink('login')}
          />
          <SignUpLink
            isSelected={selectedLink === 'signup'}
            onClick={() => setSelectedLink('signup')}
          />
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigationbar;
