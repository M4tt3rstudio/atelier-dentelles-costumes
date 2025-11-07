import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from './supabaseClient';
import AdvancedCalendar from './AdvancedCalendar';
import dayjs from 'dayjs';

/* ====== EmailJS (compte SMTP Ionos) ====== */
const SERVICE_ID = 'service_8o1gjub';
const TEMPLATE_ADMIN = 'template_1noo7zq';
const TEMPLATE_CLIENT = 'template_vxdrrgi';
const EMAILJS_PUBLIC_KEY = 'hYxOlttlW-ev6_9GL';

export default function ConceptForm({ conceptKey }) {
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [lastBooked, setLastBooked] = useState(null);

  useEffect(() => {
    try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch {}
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormMessage('');
    setFormStatus('');

    const form = e.target;
    const email = form.user_email?.value?.trim();
    const description = (form.description?.value || form.demande?.value || '').trim();

    if (!email || !description || !selectedDate || !selectedHour) {
      setFormStatus('error');
      setFormMessage("❗ Merci de remplir tous les champs obligatoires, y compris la sélection d'un créneau.");
      setIsSubmitting(false);
      return;
    }

    try {
      // === Uploads Supabase ===
      const photoFiles = Array.from(form.photos?.files || []);
      const factureFile = form.facture?.files?.[0];

      const photoUploadPromises = photoFiles.map(async (file) => {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `reservations/photos/${Date.now()}-${cleanName}`;
        const { error } = await supabase.storage.from('reservations').upload(filePath, file);
        if (error) throw error;
        const { data } = supabase.storage.from('reservations').getPublicUrl(filePath);
        return data.publicUrl;
      });

      const [photoUrls, factureUrl] = await Promise.all([
        Promise.all(photoUploadPromises),
        (async () => {
          if (!factureFile) return '';
          const cleanName = factureFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filePath = `reservations/factures/${Date.now()}-${cleanName}`;
          const { error } = await supabase.storage.from('reservations').upload(filePath, factureFile);
          if (error) throw error;
          const { data } = supabase.storage.from('reservations').getPublicUrl(filePath);
          return data.publicUrl;
        })(),
      ]);

      // === 2) Réservation Supabase ===
      const dayISO = dayjs(selectedDate).format('YYYY-MM-DD');
      const hourHHMM = String(selectedHour).slice(0, 5);

      const { error: insertErr } = await supabase
        .from('reservations')
        .insert({
          date: dayISO,
          hour: hourHHMM,
          name: '',
          email,
          message: description
        });

      if (insertErr) {
        if (String(insertErr.code) === '23505') {
          setFormStatus('error');
          setFormMessage("⚠️ Ce créneau vient d'être pris. Merci d'en choisir un autre.");
          setSelectedHour(null);
          setIsSubmitting(false);
          return;
        }
        throw insertErr;
      }

      // ✅ Notifie le calendrier (rafraîchissement instantané)
      setLastBooked({ date: dayISO, hour: hourHHMM });
      window.dispatchEvent(new CustomEvent('reservation:created', {
        detail: { date: dayISO, hour: hourHHMM }
      }));

      // === 3) Envoi EmailJS ===
      const templateParams = {
        user_email: email,
        description,
        rdv_date: selectedDate ? selectedDate.toLocaleDateString('fr-FR') : '',
        rdv_hour: hourHHMM,
        concept: conceptKey,
        type_retouche: form.type_retouche?.value || '',
        article: form.article?.value || '',
        date_achat: form.date_achat?.value || '',
        prix_achat: form.prix_achat?.value || '',
        etat: form.etat?.value || '',
        photos_urls: photoUrls.join('\n'),
        facture_url: factureUrl || ''
      };

      const adminParams = { ...templateParams };
      const userParams = { ...templateParams, to_email: email, reply_to: email };
      const opts = { publicKey: EMAILJS_PUBLIC_KEY };

      await Promise.all([
        emailjs.send(SERVICE_ID, TEMPLATE_ADMIN, adminParams, opts),
        emailjs.send(SERVICE_ID, TEMPLATE_CLIENT, userParams, opts)
      ]);

      setFormStatus('success');
      setFormMessage('✅ Message envoyé avec succès !');
      form.reset();
      setSelectedHour(null);

    } catch (error) {
      console.error('Email/Supabase error:', error);
      setFormStatus('error');
      setFormMessage(`❌ Une erreur est survenue : ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const MessageDisplay = () =>
    formMessage && (
      <span
        style={{
          color: formStatus === 'success' ? 'lightgreen' : 'salmon',
          fontSize: '0.9rem',
          whiteSpace: 'nowrap'
        }}
      >
        {formMessage}
      </span>
    );

  return (
    <form className="formulaire" onSubmit={sendEmail} noValidate>
      <input type="hidden" name="selected_date" value={selectedDate || ''} />
      <input type="hidden" name="selected_hour" value={selectedHour || ''} />

      <label>📅 Veuillez sélectionner un créneau de rendez-vous :</label>
      <AdvancedCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedHour={selectedHour}
        setSelectedHour={setSelectedHour}
        lastBooked={lastBooked}
      />

      {conceptKey === 'Dépôt-Vente' && (
        <>
          <label>Article</label>
          <select name="article" defaultValue="">
            <option value="">-- Choisir un article --</option>
            <option>Veste</option><option>Gilet</option><option>Chemise</option>
            <option>Pantalon</option><option>Robe de mariée</option>
            <option>Robe de cocktail</option><option>Vêtement enfants</option>
            <option>Accessoire</option>
          </select>

          <label>Date d'achat</label>
          <select name="date_achat" defaultValue="">
            <option value="">-- Sélectionner --</option>
            <option>1 an</option><option>2 ans</option><option>3 ans</option><option>+ de 3 ans</option>
          </select>

          <label>Prix d'achat (€)</label>
          <input type="number" name="prix_achat" placeholder="Ex : 150" min="0" step="0.01" />

          <label>État</label>
          <select name="etat" defaultValue="">
            <option value="">-- État du vêtement --</option>
            <option>Neuf</option><option>Très bon état</option>
            <option>Bon état</option><option>Usé</option>
          </select>

          <label>📸 Photos</label>
          <input type="file" name="photos" multiple accept="image/*" />

          <label>🧾 Facture (PDF ou image, facultatif)</label>
          <input type="file" name="facture" accept=".pdf,image/*" />

          <label>Description</label>
          <textarea name="description" rows="4" placeholder="Décrivez votre article..." />
        </>
      )}

      {conceptKey === 'Retouches & Création' && (
        <>
          <label>Type de retouche</label>
          <select name="type_retouche" defaultValue="">
            <option value="">-- Sélectionner --</option>
            <option>Veste</option><option>Gilet</option><option>Chemise</option>
            <option>Pantalon</option><option>Robe de mariée</option>
            <option>Robe de cocktail</option><option>Vêtement enfants</option>
            <option>Accessoire</option>
          </select>

          <label>📸 Joindre des images</label>
          <input type="file" name="photos" accept="image/*" multiple />

          <label>Détails de la demande</label>
          <textarea name="demande" rows="4" placeholder="Décrivez ce que vous souhaitez modifier ou créer..." />
        </>
      )}

      <label>Votre email</label>
      <input type="email" name="user_email" placeholder="exemple@email.com" required />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: '1.5rem',
        gap: '1rem'
      }}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi…' : 'Soumettre'}
        </button>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <MessageDisplay />
        </div>
      </div>
    </form>
  );
}
