import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function AdminSlots() {
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: '', hour: '', concept: 'Dépôt-Vente' });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    const { data, error } = await supabase.from('slots').select('*').order('date');
    if (!error) setSlots(data);
    else console.error('Erreur chargement slots', error.message);
  };

  const addSlot = async () => {
    if (!newSlot.date || !newSlot.hour || !newSlot.concept) return;

    const { error } = await supabase.from('slots').insert([
      { ...newSlot, is_booked: false, available: true }
    ]);

    if (!error) {
      setNewSlot({ date: '', hour: '', concept: 'Dépôt-Vente' });
      fetchSlots();
    } else {
      console.error('Erreur insertion', error.message);
    }
  };

  const deleteSlot = async (id) => {
    await supabase.from('slots').delete().eq('id', id);
    fetchSlots();
  };

  const unlockSlot = async (id) => {
    await supabase
      .from('slots')
      .update({ is_booked: false, available: true })
      .eq('id', id);
    fetchSlots();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🗓️ Administration des créneaux</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="date"
          value={newSlot.date}
          onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
        />
        <input
          type="time"
          value={newSlot.hour}
          onChange={(e) => setNewSlot({ ...newSlot, hour: e.target.value })}
        />
        <select
          value={newSlot.concept}
          onChange={(e) => setNewSlot({ ...newSlot, concept: e.target.value })}
        >
          <option>Dépôt-Vente</option>
          <option>Retouches & Création</option>
        </select>
        <button onClick={addSlot}>➕ Ajouter</button>
      </div>

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {slots.map(slot => (
          <li key={slot.id} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ flex: 1 }}>
              📅 {slot.date} ⏰ {slot.hour} — {slot.concept} — {slot.available ? '✅ Disponible' : '🔒 Réservé'}
            </span>
            <button onClick={() => deleteSlot(slot.id)} style={{ marginRight: '0.5rem' }}>🗑️ Supprimer</button>
            {!slot.available && (
              <button onClick={() => unlockSlot(slot.id)}>🔓 Libérer</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
