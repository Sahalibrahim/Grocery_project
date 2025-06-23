// src/components/HeroSection.jsx
import React from 'react';

const HeroSection = () => {
  return (
  <>
    <section className="hero">
    <nav className="navbar">
      <img src="/assets/logo.svg" alt="FoodMart Logo" className="logo" />
    </nav>
    {/* <div>
        <ul className="nav-links">
        <li>Home</li>
        <li>Categories</li>
        <li>Contact</li>
        <li>Download App</li>
      </ul>
    </div> */}
      <h1>Fresh & Organic <br></br>Groceries Delivered</h1>
      <p>Get your daily needs at your doorstep.</p>
      <button>Shop Now</button>
    </section>
    </>
  );
};

export default HeroSection;
