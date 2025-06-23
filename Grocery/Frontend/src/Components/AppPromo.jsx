// src/components/AppPromo.jsx
import React from 'react';

const AppPromo = () => {
  return (
    <section className="app-promo">
      <h2>Get Our App</h2>
      <p>Order groceries from your mobile with our app</p>
      <div className="store-buttons">
        <img src="/assets/google-play.jpg" alt="Google Play" />
        <img src="/assets/app-store.jpg" alt="App Store" />
      </div>
    </section>
  );
};

export default AppPromo;
