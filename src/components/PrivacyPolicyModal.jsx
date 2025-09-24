import React, { useEffect } from "react";

export default function PrivacyPolicyModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
      onClick={onClose}
    >
      <div className="modal-card" onClick={stop}>
        <button className="modal-close" aria-label="Fermer la fenêtre" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2 id="privacy-title">Politique de confidentialité</h2>
        </div>

        <div className="modal-content">
          <p>
            La présente politique de confidentialité décrit la manière dont
            <strong> Atelier Dentelles &amp; Costumes </strong> collecte, utilise et
            protège vos données personnelles conformément au RGPD.
          </p>

          <h3>1. Responsable du traitement</h3>
          <p>
            Atelier Dentelles &amp; Costumes — Contact :{" "}
            <a href="mailto:contact@atelier-dentelles-costumes.fr">
              contact@atelier-dentelles-costumes.fr
            </a>
          </p>

          <h3>2. Données collectées</h3>
          <ul>
            <li>Données d’identification (nom, prénom, email, téléphone…)</li>
            <li>Données de navigation (IP, pages consultées, cookies, logs)</li>
            <li>Données commerciales (demandes, devis, commandes, factures)</li>
          </ul>

          <h3>3. Finalités</h3>
          <ul>
            <li>Répondre à vos demandes et organiser des rendez-vous</li>
            <li>Exécuter nos prestations et assurer le suivi client</li>
            <li>Envoyer des informations et newsletters (avec votre consentement)</li>
            <li>Mesurer l’audience et améliorer le site</li>
            <li>Respecter nos obligations légales (comptabilité, fiscalité)</li>
          </ul>

          <h3>4. Bases légales</h3>
          <ul>
            <li>Consentement (formulaires, cookies, newsletters)</li>
            <li>Exécution d’un contrat (commande / prestation)</li>
            <li>Obligation légale (facturation, conservation)</li>
            <li>Intérêt légitime (amélioration continue, sécurité)</li>
          </ul>

          <h3>5. Durées de conservation</h3>
          <ul>
            <li>Données de contact : 3 ans après le dernier échange</li>
            <li>Données client &amp; factures : 10 ans (obligations légales)</li>
            <li>Cookies : 13 mois max</li>
          </ul>

          <h3>6. Destinataires &amp; sous-traitants</h3>
          <p>
            Les données ne sont pas revendues. Elles peuvent être transmises à des
            prestataires techniques (hébergeur, emailing, paiement) strictement pour
            fournir le service, avec des garanties appropriées.
          </p>

          <h3>7. Cookies &amp; traceurs</h3>
          <p>
            Le site utilise des cookies pour le bon fonctionnement et la mesure
            d’audience. Vous pouvez les refuser via les paramètres de votre navigateur.
          </p>

          <h3>8. Vos droits</h3>
          <p>
            Vous disposez des droits d’accès, de rectification, d’effacement, de
            limitation, d’opposition et de portabilité. Pour les exercer :{" "}
            <a href="mailto:contact@atelier-dentelles-costumes.fr">
              contact@atelier-dentelles-costumes.fr
            </a>
          </p>

          <h3>9. Mise à jour</h3>
          <p>
            Cette politique peut évoluer. Dernière mise à jour :
            {" "}{new Date().toLocaleDateString("fr-FR")}.
          </p>
        </div>
      </div>
    </div>
  );
}
