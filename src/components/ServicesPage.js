// components/ServicesPage.js
import React from 'react';

export default function ServicesPage() {
  const services = [
    { title: 'Dépôt-vente', image: 'service-depot.jpg' },
    { title: 'Retouches', image: 'service-retouche.jpg' },
    { title: 'Création sur mesure', image: 'service-creation.jpg' },
    { title: 'Location de vêtements', image: 'service-location.jpg' },
    { title: 'Stylisme événementiel', image: 'service-stylisme.jpg' },
    { title: 'Upcycling', image: 'service-upcycling.jpg' },
  ];

  return (
    <div className="section-panel">
      <div className="section-title sticky-title">
        <h2>Services</h2>
      </div>
      <div className="service-grid">
        {services.map((s, index) => (
          <div key={index} className="service-card clickable">
            <img src={`/images/${s.image}`} alt={s.title} />
            <div className="service-title">{s.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
