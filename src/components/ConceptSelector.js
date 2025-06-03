// components/ConceptSelector.js
import React from 'react';

export default function ConceptSelector({ staticLinks, activeLink, onSelect, welcomeText }) {
  return (
    <div className="section-panel">
      <div className="section-title">
        <h2>L'Atelier</h2>
      </div>
      <p className="text-content">{welcomeText}</p>

      {Object.keys(staticLinks).map((label, i) => (
        <button
          key={i}
          className={`clickable concept-button ${activeLink === label ? 'active' : ''}`}
          onClick={() => onSelect(staticLinks[label], label)}
          aria-pressed={activeLink === label}
          style={{ fontSize: '2rem' }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
