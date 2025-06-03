import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur de chargement des soumissions', error);
      } else {
        setSubmissions(data);
      }
      setLoading(false);
    };

    fetchSubmissions();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="section-panel">
      <h2>📋 Tableau des demandes</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Heure</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Concept</th>
            <th style={thStyle}>Description</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub.id}>
              <td style={tdStyle}>{sub.date || '—'}</td>
              <td style={tdStyle}>{sub.hour || '—'}</td>
              <td style={tdStyle}>{sub.user_email}</td>
              <td style={tdStyle}>{sub.concept}</td>
              <td style={tdStyle}>{sub.description || sub.demande || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '0.5rem',
  borderBottom: '1px solid #ccc',
};

const tdStyle = {
  padding: '0.5rem',
  borderBottom: '1px solid #444',
  verticalAlign: 'top',
};
