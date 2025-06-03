// 📄 StandardDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import ConceptForm from './ConceptForm';
import BookingCalendar from './BookingCalendar';
import { supabase } from './supabaseClient';
import './StandardDetails.css';

export default function StandardDetails({ content, conceptKey }) {
  const [showForm, setShowForm] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const wrapperRef = useRef(null);

  const conceptsWithForm = ['Dépôt-Vente', 'Retouches & Création'];

  const toggleForm = () => setShowForm(!showForm);

  const handleSlotSelect = ({ date, hour }) => setSelectedSlot({ date, hour });

  useEffect(() => {
    const fetchSlots = async () => {
      const { data, error } = await supabase.from('slots').select('*');
      if (!error) {
        setSlots(data);
        console.log('📆 Créneaux reçus :', data);
      }
    };
    fetchSlots();
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    const handleScroll = () => {
      if (!el) return;
      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
      setShowScrollIndicator(!isAtBottom);
    };
    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`section-panel ${conceptKey === 'Notre histoire' ? 'story-panel' : ''}`} ref={wrapperRef}>
      <div className="section-title sticky-title title-with-button">
        <h2>{`Détail - ${conceptKey}`}</h2>
        {conceptsWithForm.includes(conceptKey) && (
          <button className="clickable form-toggle-button" onClick={toggleForm}>
            {showForm ? 'Masquer le formulaire' : 'Afficher le formulaire'}
          </button>
        )}
      </div>

      {showForm ? (
        <>
          {conceptsWithForm.includes(conceptKey) && (
            <>
              {slots.length > 0 ? (
                <>
                  <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
                    📅 Veuillez sélectionner un créneau de rendez-vous :
                  </p>
                  <BookingCalendar onSlotSelect={handleSlotSelect} />
                </>
              ) : (
                <p style={{ color: 'salmon', marginBottom: '1rem' }}>
                  ❌ Aucun créneau de rendez-vous n’est actuellement disponible.
                </p>
              )}
            </>
          )}

          <ConceptForm
            conceptKey={conceptKey}
            selectedDate={selectedSlot?.date}
            selectedHour={selectedSlot?.hour}
          />
        </>
      ) : (
        <>
          {content.video && (
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', marginBottom: '1rem' }}>
              <video
                autoPlay
                muted
                loop
                playsInline
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src={`/videos/${content.video}`} type="video/mp4" />
              </video>
            </div>
          )}

          {content.images && content.images.length > 0 && (
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
                    style={{ width: '100%', height: '100%', borderRadius: '0.5rem', objectFit: 'cover' }}
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

      {showScrollIndicator && <div className="scroll-indicator">↓</div>}
    </div>
  );
}
