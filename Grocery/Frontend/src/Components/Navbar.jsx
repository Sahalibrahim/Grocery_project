// src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src="/assets/logo.png" alt="FoodMart Logo" className="logo" />
      <ul className="nav-links">
        <li>Home</li>
        <li>Categories</li>
        <li>Contact</li>
        <li>Download App</li>
      </ul>
    </nav>
  );
};

export default Navbar;
