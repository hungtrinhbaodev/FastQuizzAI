import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className='header base-label-header'>
      <div className='logo'>
        <label className='logo-label base-label-header'>
          FastQuiz AI
        </label>
      </div>
      
      <nav>
        <ul className='nav-links'>
          <li><a href="#home">Home</a></li>
          <li><a href="#quizzes">Change Account</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;