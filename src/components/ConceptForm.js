import React, { useState } from 'react';
import emailjs from 'emailjs-com';

export default function ConceptForm({ conceptKey }) {
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    const form = e.target;

    // Récupération dynamique selon les deux formulaires
    const email = form.user_email?.value;
    const description = form.description?.value || form.demande?.value;

    if (!email || !description) {
      setFormStatus('error');
      setFormMessage("❗ Merci de remplir tous les champs obligatoires.");
      return;
    }

    emailjs.sendForm(
      'TON_SERVICE_ID',    // ← remplace
      'TON_TEMPLATE_ID',   // ← remplace
      form,
      'TA_PUBLIC_KEY'      // ← remplace
    ).then(
      () => {
        setFormStatus('success');
        setFormMessage("✅ Message envoyé avec succès !");
        form.reset();
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

  // ================= FORMULAIRE DÉPÔT-VENTE =================
  if (conceptKey === 'Dépôt-Vente') {
    return (
      <form className="formulaire" onSubmit={sendEmail}>
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

        <label>Votre email</label>
        <input type="email" name="user_email" placeholder="exemple@email.com" />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginTop: '1.5rem',
          gap: '1rem'
        }}>
          <button type="submit">Soumettre pour dépôt-vente</button>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <MessageDisplay />
          </div>
        </div>
      </form>
    );
  }

  // ================= FORMULAIRE RETOUCHES & CRÉATION =================
 if (conceptKey === 'Retouches & Création') {
  return (
    <form className="formulaire" onSubmit={sendEmail}>
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

      <label>Votre email</label>
      <input type="email" name="user_email" placeholder="exemple@email.com" />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: '1.5rem',
        gap: '1rem'
      }}>
        <button type="submit">Envoyer la demande</button>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <MessageDisplay />
        </div>
      </div>
    </form>
  );
}


  return null;
}
