// src/components/CategorySection.jsx
import React from 'react';

const categories = [
  { name: 'Vegetables', img: '/assets/icon-vegetables-broccoli.png' },
  { name: 'Beverages', img: '/assets/icon-soft-drinks-bottle.png' },
  { name: 'Bakery', img: '/assets/icon-bread-baguette.png' },
];

const CategorySection = () => {
  return (
    <section className="categories">
      <h2>Shop by Category</h2>
      <div className="category-list">
        {categories.map((cat) => (
          <div className="category-card" key={cat.name}>
            <img src={cat.img} alt={cat.name} />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
