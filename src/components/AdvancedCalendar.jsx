import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './AdvancedCalendar.css';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

export default function AdvancedCalendar({ selectedDate, setSelectedDate, selectedHour, setSelectedHour }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
  const [availableHours, setAvailableHours] = useState([]);
  const [selectedDay, setSelectedDay] = useState(selectedDate || null);

  useEffect(() => {
    if (selectedDay) {
      fetchAvailableHours(selectedDay);
    }
  }, [selectedDay]);

  useEffect(() => {
    // Synchronise le jour sélectionné depuis les props si ça vient de l'extérieur
    if (selectedDate && !dayjs(selectedDate).isSame(selectedDay, 'day')) {
      setSelectedDay(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableHours = async (date) => {
    const weekday = (date.getDay() + 7) % 7; // Lundi = 0
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('weekday', weekday)
      .single();

    if (error || !data || data.is_closed) {
      setAvailableHours([]);
      return;
    }

    const generateSlots = (startStr, endStr) => {
      const slots = [];
      const [sh, sm] = startStr.split(':').map(Number);
      const [eh, em] = endStr.split(':').map(Number);
      let current = sh + sm / 60;
      const end = eh + em / 60;

      while (current < end) {
        const hours = Math.floor(current);
        const minutes = (current % 1) * 60;
        slots.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
        current += 0.5;
      }
      return slots;
    };

    let slots = [];
    if (data.morning_start && data.morning_end) {
      slots = [...slots, ...generateSlots(data.morning_start, data.morning_end)];
    }
    if (data.afternoon_start && data.afternoon_end) {
      slots = [...slots, ...generateSlots(data.afternoon_start, data.afternoon_end)];
    }

    setAvailableHours(slots);
  };

  const daysInMonth = Array.from({ length: currentMonth.daysInMonth() }, (_, i) =>
    currentMonth.date(i + 1).toDate()
  );

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedDate(day);         // ✅ synchronise avec ConceptForm
    setSelectedHour(null);        // 🔁 reset l’heure quand le jour change
  };

  const handleHourClick = (hour) => {
    if (!selectedDay) return;
    setSelectedHour(hour);        // ✅ synchronise avec ConceptForm
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <button onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}>◀</button>
        <span>{currentMonth.format('MMMM YYYY')}</span>
        <button onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}>▶</button>
      </div>

      <div className="calendar-grid">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d, i) => (
          <div key={i} className="calendar-day"><strong>{d}</strong></div>
        ))}

        {daysInMonth.map((day, i) => {
          const isOld = dayjs(day).isBefore(dayjs(), 'day');
          const isSelected = selectedDay && dayjs(day).isSame(selectedDay, 'day');
          return (
            <div
              key={i}
              className={`calendar-day ${isOld ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => !isOld && handleDayClick(day)}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>

      {selectedDay && availableHours.length > 0 && (
        <div className="hour-grid">
          {availableHours.map((hour, i) => (
            <div
              key={i}
              className={`hour-slot ${selectedHour === hour ? 'selected' : ''}`}
              onClick={() => handleHourClick(hour)}
            >
              {hour}
            </div>
          ))}
        </div>
      )}

      {selectedDay && availableHours.length === 0 && (
        <p style={{ marginTop: '1rem' }}>Aucun créneau disponible pour ce jour.</p>
      )}
    </div>
  );
}
