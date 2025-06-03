// components/ConceptButtons.js
import React from 'react';

export default function ConceptButtons({ concepts, activeLink, onSelect }) {
  return (
    <div className="section-panel">
      <div className="section-title">
        <h2>Concept</h2>
      </div>
      {concepts.map((concept, i) => {
        const Icon = concept.icon;
        return (
          <button
            key={i}
            className={`clickable concept-button ${activeLink === concept.label ? 'active' : ''}`}
            onClick={() => onSelect(concept.detail, concept.label)}
            style={{ fontSize: '2rem', display: 'flex', alignItems: 'center' }}
          >
            <Icon style={{ marginRight: '0.5rem' }} /> {concept.label}
          </button>
        );
      })}
    </div>
  );
}
