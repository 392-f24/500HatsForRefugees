import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navigation.css";
import headerIcon from '../../public/HatLogo.svg';

const Navigationbar = () => {
  const [selectedLink, setSelectedLink] = useState("");

  const navLinks = [
    { to: "/", label: "Our Impact", key: "landing" },
    { to: "/impact", label: "Get Involved", key: "impact" },
    { to: "/volunteerOpportunities", label: "Our Team", key: "volunteer" },
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
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {navLinks.map(({ to, label, key }) => (
              <NavLink
                key={key}
                to={to}
                className={`nav-item nav-link ${
                  selectedLink === key ? "active-link" : ""
                }`}
                onClick={() => setSelectedLink(key)}
              >
                {label}
              </NavLink>
            ))}
            <div className="login-signup-container ms-3">
              <NavLink
                to="/login"
                className={`nav-item login-btn ${
                  selectedLink === "login" ? "active-link" : ""
                }`}
                onClick={() => setSelectedLink("login")}
              >
                LOG IN
              </NavLink>
              <NavLink
                to="/signUp"
                className={`nav-item sign-up ${
                  selectedLink === "signup" ? "active-link" : ""
                }`}
                onClick={() => setSelectedLink("signup")}
              >
                SIGN UP
              </NavLink>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigationbar;
