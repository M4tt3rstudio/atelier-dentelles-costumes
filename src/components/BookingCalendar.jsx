import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './BookingCalendar.css';

export default function BookingCalendar({ onSlotSelect }) {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  useEffect(() => {
  const fetchSlots = async () => {
    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Erreur Supabase :', error);
    } else {
      console.log('Slots reçus :', data); // 🔍 Ajoute ceci
      setSlots(data);
    }
  };

  fetchSlots();
}, []);


  useEffect(() => {
    const fetchSlots = async () => {
      const { data, error } = await supabase
        .from('slots')
        .select('*')
        .order('date', { ascending: true });

      if (!error && data) setSlots(data);
    };

    fetchSlots();
  }, []);

  const availableDates = [...new Set(slots.map(slot => slot.date))];

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedHour(null);
  };

  const handleHourClick = (hour) => {
    setSelectedHour(hour);
    onSlotSelect({ date: selectedDate, hour });
  };

  return (
    <div className="calendar-container">
      <div className="date-list">
        {availableDates.map(date => (
          <button
            key={date}
            className={`calendar-date ${selectedDate === date ? 'selected' : ''}`}
            onClick={() => handleDateClick(date)}
          >
            {date}
          </button>
        ))}
      </div>

      {selectedDate && (
        <div className="hour-list">
          {slots
            .filter(slot => slot.date === selectedDate && slot.available)
            .map(slot => (
              <button
                key={slot.id}
                className={`calendar-hour ${selectedHour === slot.hour ? 'selected' : ''}`}
                onClick={() => handleHourClick(slot.hour)}
              >
                {slot.hour}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
