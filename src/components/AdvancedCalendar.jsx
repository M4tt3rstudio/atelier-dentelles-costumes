import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './AdvancedCalendar.css';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

export default function AdvancedCalendar({
  selectedDate,
  setSelectedDate,
  selectedHour,
  setSelectedHour,
  lastBooked
}) {
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
  const [availableHours, setAvailableHours] = useState([]);
  const [selectedDay, setSelectedDay] = useState(selectedDate || null);

  // Charge les créneaux quand le jour change
  useEffect(() => {
    if (selectedDay) fetchAvailableHours(selectedDay);
  }, [selectedDay]);

  // Synchronise date externe
  useEffect(() => {
    if (selectedDate && !dayjs(selectedDate).isSame(selectedDay, 'day')) {
      setSelectedDay(selectedDate);
    }
  }, [selectedDate]);

  // Realtime Supabase
  useEffect(() => {
    const channel = supabase
      .channel('reservations-watch')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, (payload) => {
        if (!selectedDay) return;
        const d = dayjs(selectedDay).format('YYYY-MM-DD');
        const changed = payload.new?.date || payload.old?.date;
        if (changed === d) fetchAvailableHours(selectedDay);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedDay]);

  // Événement local → retrait instantané du slot
  useEffect(() => {
    const toHHMM = (str) => (str ? String(str).trim().slice(0,5) : '');
    const handler = (e) => {
      if (!selectedDay) return;
      const d = dayjs(selectedDay).format('YYYY-MM-DD');
      const changedDate = e.detail?.date;
      const changedHour = toHHMM(e.detail?.hour);
      if (changedDate !== d) return;

      if (changedHour) {
        setAvailableHours(prev => prev.filter(h => toHHMM(h) !== changedHour));
      } else {
        fetchAvailableHours(selectedDay);
      }
    };
    window.addEventListener('reservation:created', handler);
    return () => window.removeEventListener('reservation:created', handler);
  }, [selectedDay]);

  // Retrait immédiat si parent a passé lastBooked
  useEffect(() => {
    if (!lastBooked || !selectedDay) return;
    const d = dayjs(selectedDay).format('YYYY-MM-DD');
    if (lastBooked.date !== d) return;
    const hour = String(lastBooked.hour).slice(0, 5);
    setAvailableHours(prev => prev.filter(h => h.slice(0, 5) !== hour));
  }, [lastBooked, selectedDay]);

  const fetchAvailableHours = async (dateObj) => {
    const weekday = (dateObj.getDay() + 6) % 7; // Lundi = 0

    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('weekday', weekday)
      .single();

    if (error || !data || data.is_closed) {
      setAvailableHours([]);
      return;
    }

    const gen = (start, end) => {
      const out = [];
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      let cur = sh + (sm || 0) / 60;
      const stop = eh + (em || 0) / 60;
      while (cur < stop) {
        const h = Math.floor(cur);
        const m = (cur % 1) * 60;
        out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        cur += 0.5;
      }
      return out;
    };

    let slots = [];
    if (data.morning_start && data.morning_end) slots.push(...gen(data.morning_start, data.morning_end));
    if (data.afternoon_start && data.afternoon_end) slots.push(...gen(data.afternoon_start, data.afternoon_end));
    slots = slots.map(s => s.slice(0,5));

    const dayISO = dayjs(dateObj).format('YYYY-MM-DD');
    const { data: resv } = await supabase.from('reservations').select('hour').eq('date', dayISO);
    const taken = new Set((resv || []).map(r => String(r.hour).trim().slice(0,5)));
    const free = slots.filter(h => !taken.has(h));
    setAvailableHours(free);
  };

  const daysInMonth = Array.from({ length: currentMonth.daysInMonth() }, (_, i) =>
    currentMonth.date(i + 1).toDate()
  );

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedDate(day);
    setSelectedHour(null);
  };

  const handleHourClick = (hour) => {
    if (!selectedDay) return;
    setSelectedHour(hour);
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
