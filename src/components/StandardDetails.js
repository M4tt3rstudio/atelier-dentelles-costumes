import React, { useState, useRef } from 'react';
import ConceptForm from './ConceptForm';
import './StandardDetails.css';

export default function StandardDetails({ content, conceptKey }) {
  const [showForm, setShowForm] = useState(false);
  const wrapperRef = useRef(null);

  const conceptsWithForm = ['Dépôt-Vente', 'Retouches & Création'];

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  // --- Définition des libellés pour chaque concept ---
  const getCta = () => {
    if (conceptKey === 'Dépôt-Vente') {
      return {
        title: 'Planifier votre visite',
        subtitle: 'et nous transmettre vos pièces dès aujourd’hui',
      };
    }
    if (conceptKey === 'Retouches & Création') {
      return {
        title: 'Planifier un rendez-vous',
        subtitle: 'et déposer photos, mesures et inspirations',
      };
    }
    return { title: 'Planifier votre visite', subtitle: '' };
  };

  const { title, subtitle } = getCta();

  return (
    <div
      className={`section-panel ${conceptKey === 'Notre histoire' ? 'story-panel' : ''}`}
      ref={wrapperRef}
    >
      <div className="section-title sticky-title title-with-button">
        <h2 className="sd-title hyphenate" lang="fr">{conceptKey}</h2>

        {conceptsWithForm.includes(conceptKey) && (
          <button
            className={`form-toggle-button ${showForm ? 'active' : ''}`}
            onClick={toggleForm}
            aria-label={`${title}${subtitle ? ' — ' + subtitle : ''}`}
          >
            {!showForm ? (
              <>
                <span className="cta-title">{title}</span>
                {subtitle && <span className="cta-sub">{subtitle}</span>}
              </>
            ) : (
              <>
                <span className="cta-title">Fermer la prise de rendez-vous</span>
                <span className="cta-sub">revenir à la présentation</span>
              </>
            )}
          </button>
        )}
      </div>

      {showForm ? (
        <ConceptForm conceptKey={conceptKey} />
      ) : (
        <>
          {content.video && (
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%',
                marginBottom: '1rem',
              }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              >
                <source src={`/videos/${content.video}`} type="video/mp4" />
              </video>
            </div>
          )}

          {content.images?.length > 0 && (
            <div className="bento-gallery">
              {content.images.map((img, i) => (
                <div
                  key={i}
                  style={{
                    gridColumn: i % 3 === 1 ? 'span 2' : 'span 1',
                    aspectRatio: i % 3 === 1 ? '16 / 9' : '1 / 1',
                    width: '100%',
                  }}
                >
                  <img
                    src={`/images/${img}`}
                    alt={`Image ${i + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '0.5rem',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {content.text && (
            <div className="text-content" style={{ marginBottom: '2rem' }}>
              <p>{content.text}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
