import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} LawQuiz Project. All rights reserved.</p>
      <div className="socials">
        <span>Facebook</span> | <span>GitHub</span>
      </div>
    </footer>
  );
};

export default Footer;