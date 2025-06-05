import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function AdminCalendar() {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('availability')
        .select('*');

      if (error) {
        console.error(error);
        return;
      }

      const sorted = Array(7).fill(null);
      data.forEach(row => {
        sorted[row.weekday] = row;
      });
      setAvailabilities(sorted);
      setLoading(false);
    };

    fetchData();
  }, []);

  const updateAvailability = (index, field, value) => {
    const updated = [...availabilities];
    updated[index] = { ...updated[index], [field]: value };
    setAvailabilities(updated);
  };

  const saveAvailability = async (index) => {
    const row = availabilities[index];
    const { id, ...values } = row;

    const { error } = await supabase
      .from('availability')
      .update(values)
      .eq('id', id);

    if (error) {
      alert("Erreur lors de la sauvegarde : " + error.message);
    } else {
      alert("Disponibilité mise à jour !");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Administration des horaires</h2>
      <table>
        <thead>
          <tr>
            <th>Jour</th>
            <th>Fermé</th>
            <th>Matin Début</th>
            <th>Matin Fin</th>
            <th>Après-midi Début</th>
            <th>Après-midi Fin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {availabilities.map((row, i) => (
            <tr key={i}>
              <td>{days[i]}</td>
              <td>
                <input
                  type="checkbox"
                  checked={row?.is_closed || false}
                  onChange={(e) => updateAvailability(i, 'is_closed', e.target.checked)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={row?.morning_start || ''}
                  disabled={row?.is_closed}
                  onChange={(e) => updateAvailability(i, 'morning_start', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={row?.morning_end || ''}
                  disabled={row?.is_closed}
                  onChange={(e) => updateAvailability(i, 'morning_end', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={row?.afternoon_start || ''}
                  disabled={row?.is_closed}
                  onChange={(e) => updateAvailability(i, 'afternoon_start', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={row?.afternoon_end || ''}
                  disabled={row?.is_closed}
                  onChange={(e) => updateAvailability(i, 'afternoon_end', e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => saveAvailability(i)}>💾 Sauver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
