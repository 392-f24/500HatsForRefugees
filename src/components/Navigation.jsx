import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navigation.css";
import headerIcon from '../../public/HatLogo.svg';

const Navigationbar = () => {
  const [selectedLink, setSelectedLink] = useState("");
  const location = useLocation(); // Get current location to check for active route
  const navigate = useNavigate(); // Get navigate function from react-router-dom

  // Define navigation links
  const navLinks = [
    { to: "/", key: "landing" },
    { to: "/impact", label: "Our Impact", key: "impact" },
    { to: "/volunteerOpportunities", label: "Get Involved", key: "volunteer" },
  ];

  // Function to handle click on the Navbar.Brand and navigate to the landing page
  const handleBrandClick = () => {
    setSelectedLink(""); // Set to "landing" for active link highlight
    navigate("/"); // Programmatically navigate to the landing page
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand className="brand-logo" onClick={handleBrandClick}>
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
