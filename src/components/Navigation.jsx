import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css';
import headerIcon from '../../public/HatLogo.svg';

const Navigationbar = () => {
  const location = useLocation();

  // Define navigation links
  const navLinks = [
    { to: "/impact", label: "Our Impact", key: "impact" },
    { to: "/volunteerOpportunities", label: "Get Involved", key: "volunteer" },
    // { to: "/volunteerOpportunities", label: "Our Team", key: "volunteer" }
  ];

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
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {navLinks.map(({ to, label, key }) => (
              <NavLink
                key={key}
                to={to}
                className={`nav-item nav-link ${
                  location.pathname === to ? "active-link" : ""
                }`}
              >
                {label}
              </NavLink>
            ))}
            {/* Login and Signup Buttons */}
            <div className="login-signup-container ms-3">
              <Button variant="dark" as={NavLink} to="/login">
                LOG IN
              </Button>
              <Button variant="light" as={NavLink} to="/signUp">
                SIGN UP
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigationbar;
