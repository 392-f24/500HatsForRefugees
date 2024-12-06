// Footer.jsx
import React from 'react';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footerBrandTitle">&copy; {new Date().getFullYear()} 500HatsForRefugees</p>
      <div className="ContactAndDetails"> 
        <p>Contact Margie through phone: XXX-XXX-XXXX</p>
      </div>
    </footer>
  );
};

export default Footer;
