import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';
import Navbar from 'react-bootstrap/Navbar';
import headerIcon from '../../public/headerIcon.png';

const LandingPageLink = ({ isSelected, onClick }) => (
  <NavLink to="/" className="nav-item" onClick={onClick}>
    <p className={`navText ${isSelected ? 'active-link' : ''}`}>Our Impact</p>
  </NavLink>
);

const ImpactPageLink = ({ isSelected, onClick }) => (
  <NavLink to="/impact" className="nav-item" onClick={onClick}>
    <p className={`navText ${isSelected ? 'active-link' : ''}`}>Get Involved</p>
  </NavLink>
);

const VolunteerOpportunitiesLink = ({ isSelected, onClick }) => (
  <NavLink to="/volunteerOpportunities" className="nav-item" onClick={onClick}>
    <p className={`navText ${isSelected ? 'active-link' : ''}`}>Our Team</p>
  </NavLink>
);

const LoginLink = ({ isSelected, onClick }) => (
  <NavLink to="/login" className="nav-item login-btn" onClick={onClick}>
    <p className={`navText ${isSelected ? 'active-link' : ''}`}>LOG IN</p>
  </NavLink>
);

const SignUpLink = ({ isSelected, onClick }) => (
  <NavLink to="/signUp" className="nav-item sign-up" onClick={onClick}>
    <p className={`navText ${isSelected ? 'active-link' : ''}`}>SIGN UP</p>
  </NavLink>
);

const Navigationbar = () => {
  const [selectedLink, setSelectedLink] = useState('');

  return (
    <Navbar expand="lg" className="custom-navbar">
      <div className="container-fluid">
        <Navbar.Brand href="/" className="brand-logo">
          <img src={headerIcon} alt="Logo" className="header-icon" />
          <div className="brand-text-container">
            <span className="brand-text">500HatsForRefugees</span>
            <span className="brand-subtext">Chicago, IL</span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="navbar-nav nav-items-container">
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
            <div className="login-signup-container">
            <LoginLink
              isSelected={selectedLink === 'login'}
              onClick={() => setSelectedLink('login')}
            />
            <SignUpLink
              isSelected={selectedLink === 'signup'}
              onClick={() => setSelectedLink('signup')}
            />
          </div>
          </div>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Navigationbar;
