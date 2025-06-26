// src/components/HeroSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate()
  const handleShopNow = () => {
    navigate('/login')
  }
  return (
  <>
    <section className="hero">
    <nav className="navbar">
      <img src="/assets/logo.svg" alt="FoodMart Logo" className="logo" />
    </nav>
      <h1>Fresh & Organic <br></br>Groceries Delivered</h1>
      <p>Get your daily needs at your doorstep.</p>
      <button onClick={handleShopNow}>Shop Now</button>
    </section>
    </>
  );
};

export default HeroSection;
