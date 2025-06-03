// AtelierApp.js (version adaptée pour afficher une seule section sur mobile)

import React, { useState, useEffect, useRef } from 'react';
import ConceptSelector from './ConceptSelector';
import ConceptDetails from './ConceptDetails';
import MobileMenu from './MobileMenu';
import '.index';

const AtelierApp = () => {
  const [conceptKey, setConceptKey] = useState('Notre histoire');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-wrapper">
      <div className="main-header">
        <img src="logo192.png" alt="Logo" className="logo-image" />
        <h1 className="main-title">Les Ateliers <span className="ampersand">&</span> Costumes</h1>
      </div>

      {isMobile ? (
        <>
          <MobileMenu onSelect={setConceptKey} />
          <div className="section-row">
            <div className="section-panel" ref={wrapperRef}>
              <ConceptDetails conceptKey={conceptKey} />
            </div>
          </div>
        </>
      ) : (
        <div className="section-row">
          <div className="section-panel">
            <ConceptSelector onSelect={setConceptKey} />
          </div>
          <div className="section-panel" ref={wrapperRef}>
            <ConceptDetails conceptKey={conceptKey} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AtelierApp;
