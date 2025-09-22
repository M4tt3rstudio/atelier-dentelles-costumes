import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser'; // <-- remplace 'emailjs-com'
import { supabase } from './supabaseClient';
import AdvancedCalendar from './AdvancedCalendar';

export default function ConceptForm({ conceptKey }) {
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  // Option: init une fois (sinon passe la publicKey dans send(..., { publicKey }))
  useEffect(() => {
    try {
      emailjs.init('_q6rQhvs-jM2i0LdQ'); // <- ta PUBLIC key
    } catch (e) {
      // rien de bloquant si tu fournis la clé dans send()
      console.info('EmailJS already initialized or will use inline key.');
    }
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();
    const form = e.target;

    const email = form.user_email?.value?.trim();
    const description = (form.description?.value || form.demande?.value || '').trim();

    if (!email || !description || !selectedDate || !selectedHour) {
      setFormStatus('error');
      setFormMessage("❗ Merci de remplir tous les champs obligatoires, y compris la sélection d'un créneau.");
      return;
    }

    try {
      // --------------------------
      // 1) Uploads Supabase (en parallèle)
      // --------------------------
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

      // --------------------------
      // 2) Params partagés
      // --------------------------
      const templateParams = {
        user_email: email, // adresse saisie par l'utilisateur (affichée dans le corps)
        description,
        rdv_date: selectedDate ? selectedDate.toLocaleDateString('fr-FR') : '',
        rdv_hour: selectedHour,
        concept: conceptKey,
        type_retouche: form.type_retouche?.value || '',
        article: form.article?.value || '',
        date_achat: form.date_achat?.value || '',
        prix_achat: form.prix_achat?.value || '',
        etat: form.etat?.value || '',
        photos_urls: photoUrls.join('\n'),
        facture_url: factureUrl || ''
      };

      // --------------------------
      // 3) Envois EmailJS (admin + client)
      // --------------------------
      const adminParams = { ...templateParams }; // ton template admin envoie vers toi (To email fixé côté EmailJS)
      const userParams  = {
        ...templateParams,
        to_email: email,       // <-- DESTINATAIRE client (doit matcher {{to_email}} dans le template client)
        reply_to: email        // facultatif: répondre va au client
      };

      // en parallèle (tu peux aussi faire en séquentiel si tu préfères)
      const [adminRes, userRes] = await Promise.all([
        emailjs.send('service_l8zklu4', 'template_dw8vcls', adminParams /*, { publicKey: '_q6rQhvs-jM2i0LdQ' }*/),
        emailjs.send('service_l8zklu4', 'template_vl9ikyn', userParams  /*, { publicKey: '_q6rQhvs-jM2i0LdQ' }*/)
      ]);

      console.info('Admin mail:', adminRes?.status, adminRes?.text);
      console.info('User  mail:', userRes?.status, userRes?.text);

      // --------------------------
      // 4) UI
      // --------------------------
      setFormStatus('success');
      setFormMessage('✅ Message envoyé avec succès !');
      form.reset();
      setSelectedDate(null);
      setSelectedHour(null);

    } catch (error) {
      console.error('Email/Supabase error:', error?.text || error?.message || error);
      setFormStatus('error');
      setFormMessage(`❌ Une erreur est survenue. ${error?.text || error?.message || 'Merci de réessayer.'}`);
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
      />

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
          <input type="file" name="photos" accept="image/*" multiple />

          <label>Détails de la demande</label>
          <textarea name="demande" rows="4" placeholder="Décrivez ce que vous souhaitez modifier ou créer..." />
        </>
      )}

      <label>Votre email</label>
      <input type="email" name="user_email" placeholder="exemple@email.com" required />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginTop: '1.5rem',
          gap: '1rem'
        }}
      >
        <button type="submit">Soumettre</button>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <MessageDisplay />
        </div>
      </div>
    </form>
  );
}
