// components/Menu.js
import React from 'react';


export default function Menu({ concepts, onConceptClick, activeLink }) {
  return (
    <div className="menu">
      {concepts.map((concept, index) => {
        const Icon = concept.icon;
        return (
          <button
            key={index}
            className={`clickable ${activeLink === concept.label ? 'active' : ''}`}
            onClick={() => onConceptClick(concept.detail, concept.label)}
            aria-pressed={activeLink === concept.label}
          >
            <Icon /> {concept.label}
          </button>
        );
      })}
    </div>
  );
}
