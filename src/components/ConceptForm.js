import React, { useState } from 'react';
import { supabase } from './supabaseClient';


export default function ConceptForm({ conceptKey, selectedDate, selectedHour }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedHour) {
      setStatus('Merci de sélectionner une date et une heure dans le calendrier.');
      return;
    }

    const { name, email, phone, message } = formData;

    const { error } = await supabase.from('reservations').insert([
      {
        concept: conceptKey,
        date: selectedDate.toISOString(),
        hour: selectedHour,
        name,
        email,
        phone,
        message
      }
    ]);

    if (error) {
      console.error(error);
      setStatus("Erreur lors de l'enregistrement. Veuillez réessayer.");
    } else {
      setStatus("Réservation enregistrée avec succès !");
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    }
  };

  return (
    <form className="concept-form" onSubmit={handleSubmit}>
      <h3>Réservation : {conceptKey}</h3>
      <p>Date : <strong>{selectedDate?.toLocaleDateString()}</strong></p>
      <p>Heure : <strong>{selectedHour}</strong></p>

      <label>Nom</label>
      <input name="name" value={formData.name} onChange={handleChange} required />

      <label>Email</label>
      <input name="email" type="email" value={formData.email} onChange={handleChange} required />

      <label>Téléphone</label>
      <input name="phone" value={formData.phone} onChange={handleChange} />

      <label>Message (optionnel)</label>
      <textarea name="message" value={formData.message} onChange={handleChange} />

      <button type="submit">Envoyer la réservation</button>

      {status && <p style={{ marginTop: '1rem', color: status.includes("succès") ? 'green' : 'red' }}>{status}</p>}
    </form>
  );
}
