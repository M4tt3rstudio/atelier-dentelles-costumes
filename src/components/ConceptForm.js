import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { supabase } from './supabaseClient';
import AdvancedCalendar from './AdvancedCalendar';

const sendConfirmationEmail = (toEmail, rdvDate, rdvHour, conceptKey) => {
  return emailjs.send(
    'TON_SERVICE_ID',
    'TON_TEMPLATE_ID',
    {
      user_email: toEmail,
      rdv_date: rdvDate,
      rdv_hour: rdvHour,
      concept: conceptKey,
    },
    'TA_PUBLIC_KEY'
  );
};

export default function ConceptForm({ conceptKey }) {
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  const sendEmail = async (e) => {
    e.preventDefault();
    const form = e.target;

    const email = form.user_email?.value;
    const description = form.description?.value || form.demande?.value;

    if (!email || !description || !selectedDate || !selectedHour) {
      setFormStatus('error');
      setFormMessage("❗ Merci de remplir tous les champs obligatoires, y compris la sélection d'un créneau.");
      return;
    }

    const { error: updateError } = await supabase
      .from('slots')
      .update({ is_booked: true })
      .eq('date', selectedDate)
      .eq('hour', selectedHour);

    if (updateError) {
      setFormStatus('error');
      setFormMessage("❌ Impossible de réserver ce créneau. Veuillez réessayer.");
      return;
    }

    emailjs.sendForm(
      'TON_SERVICE_ID',
      'TON_TEMPLATE_FORM_ID',
      form,
      'TA_PUBLIC_KEY'
    ).then(
      () => {
        setFormStatus('success');
        setFormMessage("✅ Message envoyé avec succès !");
        sendConfirmationEmail(email, selectedDate, selectedHour, conceptKey);
        form.reset();
        setSelectedDate(null);
        setSelectedHour(null);
      },
      (error) => {
        console.error(error.text);
        setFormStatus('error');
        setFormMessage("❌ Une erreur est survenue. Merci de réessayer.");
      }
    );
  };

  const MessageDisplay = () =>
    formMessage && (
      <span
        style={{
          color: formStatus === 'success' ? 'lightgreen' : 'salmon',
          fontSize: '0.9rem',
          whiteSpace: 'nowrap',
        }}
      >
        {formMessage}
      </span>
    );

  return (
    <form className="formulaire" onSubmit={sendEmail}>
      {/* Champs cachés pour emailjs */}
      <input type="hidden" name="selected_date" value={selectedDate || ''} />
      <input type="hidden" name="selected_hour" value={selectedHour || ''} />

      {/* ✅ Affichage unique du calendrier */}
      <label>📅 Veuillez sélectionner un créneau de rendez-vous :</label>
      <AdvancedCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedHour={selectedHour}
        setSelectedHour={setSelectedHour}
      />

      {/* Formulaires selon le concept */}
      {conceptKey === 'Dépôt-Vente' && (
        <>
          <label>Article</label>
          <select name="article" defaultValue="">
            <option value="">-- Choisir un article --</option>
            <option>Veste</option>
            <option>Gilet</option>
            <option>Chemise</option>
            <option>Pantalon</option>
            <option>Robe de mariée</option>
            <option>Robe de cocktail</option>
            <option>Vêtement enfants</option>
            <option>Accessoire</option>
          </select>

          <label>Date d'achat</label>
          <select name="date_achat" defaultValue="">
            <option value="">-- Sélectionner --</option>
            <option>1 an</option>
            <option>2 ans</option>
            <option>3 ans</option>
            <option>+ de 3 ans</option>
          </select>

          <label>Prix d'achat (€)</label>
          <input type="number" name="prix_achat" placeholder="Ex : 150" min="0" step="0.01" />

          <label>État</label>
          <select name="etat" defaultValue="">
            <option value="">-- État du vêtement --</option>
            <option>Neuf</option>
            <option>Très bon état</option>
            <option>Bon état</option>
            <option>Usé</option>
          </select>

          <label>📸 Photos</label>
          <input type="file" name="photos" multiple accept="image/*" />

          <label>🧾 Facture (PDF ou image)</label>
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
            <option>Veste</option>
            <option>Gilet</option>
            <option>Chemise</option>
            <option>Pantalon</option>
            <option>Robe de mariée</option>
            <option>Robe de cocktail</option>
            <option>Vêtement enfants</option>
            <option>Accessoire</option>
          </select>

          <label>📸 Joindre des images</label>
          <input type="file" name="photos_retouche" accept="image/*" multiple />

          <label>Détails de la demande</label>
          <textarea
            name="demande"
            rows="4"
            placeholder="Décrivez ce que vous souhaitez modifier ou créer..."
          />
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
        <button type="submit">Soumettre</button>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <MessageDisplay />
        </div>
      </div>
    </form>
  );
}
