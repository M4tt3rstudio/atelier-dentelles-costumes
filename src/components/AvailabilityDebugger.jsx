import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function AvailabilityDebugger() {
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      const { data, error } = await supabase.from('availability').select('*').order('weekday', { ascending: true });

      if (error) {
        console.error('Erreur Supabase :', error.message);
      } else {
        setAvailability(data);
      }
    };

    fetchAvailability();
  }, []);

  return (
    <div style={{ padding: '1rem', background: '#f0f0f0', fontFamily: 'monospace' }}>
      <h3>📅 Availability Debugger</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>weekday</th>
            <th>morning_start</th>
            <th>morning_end</th>
            <th>afternoon_start</th>
            <th>afternoon_end</th>
            <th>is_closed</th>
          </tr>
        </thead>
        <tbody>
          {availability.map((row) => (
            <tr key={row.weekday}>
              <td>{row.weekday}</td>
              <td>{row.morning_start || '—'}</td>
              <td>{row.morning_end || '—'}</td>
              <td>{row.afternoon_start || '—'}</td>
              <td>{row.afternoon_end || '—'}</td>
              <td>{row.is_closed ? 'true' : 'false'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AvailabilityDebugger;


