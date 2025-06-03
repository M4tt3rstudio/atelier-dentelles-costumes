import React, { useState } from 'react';
import './AtelierApp.css'; // Assure-toi que ce fichier est bien importé
import Menu from './components/Menu'; // Ton composant Menu
import ConceptSelector from './components/ConceptSelector';
import ConceptButtons from './components/ConceptButtons';
import StandardDetails from './components/StandardDetails';
import BoutiqueDetails from './components/BoutiqueDetails';
import FaqPage from './components/FaqPage';
import ServicesPage from './components/ServicesPage';
import OurStory from './components/OurStory';

import { FaCut, FaStore, FaShoppingBag } from 'react-icons/fa';

export default function AtelierApp() {
  const defaultWelcomeDetail = {
    text: `Bienvenue à notre atelier de couture et de création textile...Bienvenue dans l’univers délicat de l’Atelier Dentelles & Costumes, où chaque création célèbre l’amour et l’élégance à l’état pur.

    Spécialisé dans les pièces uniques pour mariages et cérémonies, notre atelier redonne vie aux savoir-faire anciens à travers des robes en dentelle sur-mesure, des corsets romantiques, des voiles brodés à la main ou encore des détails couture inspirés d’époques révolues 👑.
    
    Ici, chaque fil tisse une émotion. Nous imaginons avec vous la tenue de vos rêves, en mêlant tradition, raffinement et touche personnelle 💫.
    
    Que vous rêviez d’une silhouette d’inspiration vintage, d’un clin d’œil baroque ou d’une robe aux allures féeriques, notre atelier vous accompagne dans cette création précieuse — pour que le jour J reste inoubliable jusque dans les moindres détails.
    
    🎀 Un lieu hors du temps, pour des mariages hors du commun.`,
    video: 'default.mp4',
    images: []
  };

  const concepts = [
    {
      label: 'Dépôt-Vente',
      detail: {
        text: 'Découvrez notre service de dépôt-vente de vêtements uniques.',
        video: 'dépôt-vente.mp4',
        images: ['dépôt-vente-1.jpg', 'dépôt-vente-2.jpg', 'dépôt-vente-3.jpg']
      },
      icon: FaCut,
    },
    {
      label: 'Boutique',
      detail: {},
      icon: FaStore,
    },
    {
      label: 'Retouches & Création',
      detail: {
        text: 'Notre service de retouches et de créations sur-mesure.',
        video: 'retouches-&-création.mp4',
        images: ['retouches-&-création-1.jpg', 'retouches-&-création-2.jpg', 'retouches-&-création-3.jpg']
      },
      icon: FaShoppingBag,
    },
  ];

  const staticLinks = {
    'Notre histoire': '',
    'FAQ 💬 & Contact': '',
    'Services': ''
  };

  const [conceptDetails, setConceptDetails] = useState(defaultWelcomeDetail);
  const [selectedConcept, setSelectedConcept] = useState('Bienvenue');
  const [activeLink, setActiveLink] = useState('Bienvenue');
  const [filter, setFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('toutes');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [refreshBoutique, setRefreshBoutique] = useState(false);

  const handleConceptChange = (detail, key) => {
    const concept = concepts.find(c => c.label === key);
    if (concept) {
      setConceptDetails(concept.detail);
    } else if (staticLinks[key]) {
      setConceptDetails(staticLinks[key]);
    }
    setSelectedConcept(key);
    setActiveLink(key);
    setFilter('all');
    setSelectedCategory('toutes');

    if (key === 'Boutique') {
      setRefreshBoutique(true);
      setTimeout(() => setRefreshBoutique(false), 100);
    }
  };

  const renderContent = () => {
    switch (selectedConcept) {
      case 'Bienvenue':
        return <StandardDetails key="Bienvenue" content={defaultWelcomeDetail} conceptKey="Bienvenue" />;
      case 'Boutique':
        return (
          <BoutiqueDetails
            key="Boutique"
            filter={filter}
            setFilter={setFilter}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setLightboxImage={setLightboxImage}
            refreshTrigger={refreshBoutique}
          />
        );
      case 'FAQ 💬 & Contact':
        return <FaqPage key="FAQ" />;
      case 'Services':
        return <ServicesPage key="Services" />;
      case 'Notre histoire':
        return <OurStory key="OurStory" />;
      default:
        return <StandardDetails key={selectedConcept} content={conceptDetails} conceptKey={selectedConcept} />;
    }
  };

  return (
    <div className="app-wrapper">
      {/* Menu caché pour le SEO */}
      <Menu 
        concepts={concepts} 
        onConceptClick={handleConceptChange} 
        activeLink={activeLink} 
        className="menu-hidden"  // Applique la classe CSS ici
      />
      <div className="main-header">
        <img src="/images/Logo-light.svg" alt="Logo Atelier" className="logo-image" />
        <h1 className="main-title">
          Atelier Dentelles <span className="ampersand">&</span> Costumes
        </h1>
      </div>
      <div className="section-row">
        <ConceptSelector
          staticLinks={staticLinks}
          activeLink={activeLink}
          onSelect={handleConceptChange}
          welcomeText={defaultWelcomeDetail.text}
        />
        <ConceptButtons
          concepts={concepts}
          activeLink={activeLink}
          onSelect={handleConceptChange}
        />
        <div style={{ flex: 2.25 }} key={selectedConcept} className="fade-in">
          {renderContent()}
          {lightboxImage && (
            <div className="lightbox" onClick={() => setLightboxImage(null)}>
              <img src={lightboxImage} alt="agrandissement" />
            </div>
          )}
        </div>
      </div>
      <div className="footer">
        <div className="newsletter">
          <a href="/newsletter.pdf" download className="clickable">
            Télécharger la newsletter
          </a>
        </div>
        <div className="social-links">
          <span className="clickable">Instagram</span>
          <span className="clickable">Facebook</span>
          <span className="clickable">TikTok</span>
        </div>
      </div>
    </div>
  );
}
