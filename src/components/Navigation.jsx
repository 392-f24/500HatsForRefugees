import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import headerIcon from '/HatLogo.svg';
import { useAuthState, signOut , useDbData } from "../utilities/firebase";
import "./Navigation.css";

const Navigationbar = () => {
  const [user] = useAuthState();
  const [userData, userDataError] = useDbData(user ? `users/${user.uid}` : null);
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

  const handleLogout = async () => {
    try {
      await signOut();
      console.log("User signed out successfully");
      navigate("/login"); 
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
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
              {/* Dynamic Login/Logout Buttons */}
              <div className="login-signup-container ms-3 ">
              {user ? (
                <>
                  <span className="brand-subtext">
                    Welcome, {userData?.username || user.email}
                  </span>
                  <Button
                    className="white-btn" 
                    variant="light"
                    onClick={handleLogout}
                  >
                    LOG OUT
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="black-btn"
                    variant="dark"
                    as={NavLink}
                    to="/login"
                  >
                    LOG IN
                  </Button>
                  <Button
                    className="white-btn"
                    variant="light"
                    as={NavLink}
                    to="/signUp"
                  >
                    SIGN UP
                  </Button>
                </>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigationbar;
