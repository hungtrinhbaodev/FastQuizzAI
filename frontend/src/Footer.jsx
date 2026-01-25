import React from 'react';
import './Footer.css';
import AppConst from './services/AppConst';
import appService from './services/AppService';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} LawQuiz Project. All rights reserved.</p>
      <div className="socials">
        <span>Facebook</span> | <span>GitHub</span>
      </div>
      {/* {AppConst.DEV_MODE && (
        <button
          className='footer-button-test-api'
          onClick={() => {appService.onTestAPI()}}
        >
          TEST API
        </button>
      )} */}
    </footer>
  );
};

export default Footer;