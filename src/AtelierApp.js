import React, { useState, useEffect } from 'react';

import './AtelierApp.css';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Menu from './components/Menu';
import ConceptSelector from './components/ConceptSelector';
import ConceptButtons from './components/ConceptButtons';
import StandardDetails from './components/StandardDetails';
import BoutiqueDetails from './components/BoutiqueDetails';
import FaqPage from './components/FaqPage';
import ServicesPage from './components/ServicesPage';
import OurStory from './components/OurStory';
import AdminBoutique from './components/AdminBoutique';

import { FaCut, FaStore, FaShoppingBag } from 'react-icons/fa';


import AdminCalendar from './components/AdminCalendar'; // 👈 Importe ton nouveau composant


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
      text: `♻️ Dépôt-vente de vêtements de cérémonie  
Donnez une seconde vie à vos tenues d’exception.

Vous avez porté une robe de mariée, un costume de cérémonie ou une tenue de fête que vous ne remettrez plus ?  
Plutôt que de la laisser prendre la poussière, offrez-lui une nouvelle histoire à vivre.

À l’atelier, nous vous proposons un service de dépôt-vente dédié aux vêtements de cérémonie :

• Robes de mariée  
• Costumes sur mesure  
• Tenues de soirée ou de scène  
• Accessoires élégants (voiles, capes, étoles, etc.)

Nous sélectionnons chaque pièce avec soin, puis la mettons en valeur dans notre espace ou en ligne, auprès d’une clientèle sensible à l’artisanat, à la qualité et à la seconde main.

✨ Une démarche éthique et élégante, où rien ne se perd, tout se transforme.  
✨ Un accompagnement personnalisé pour valoriser vos pièces au juste prix.

Vous souhaitez déposer une tenue ?  
Contactez-nous ou venez nous rencontrer à l’atelier. Ensemble, faisons circuler la beauté autrement.`,
      video: 'depot-vente-1.mp4',
images: [
  '/depot-vente-1.jpg',
  '/depot-vente-2.jpg',
  '/depot-vente-3.jpg'
]

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
      text: `✂️ Retouches & Création  
Sublimer l'existant, imaginer l'inédit.

Chaque vêtement porte une histoire. Que ce soit pour ajuster une robe précieuse, moderniser une tenue de cérémonie ou donner naissance à une création sur-mesure, notre atelier met son savoir-faire au service de vos envies.

Nous proposons :  
• Des retouches fines et soignées, pour une coupe parfaite et un tombé impeccable.  
• Des transformations créatives, pour redonner vie à des pièces oubliées.  
• Des créations uniques, pensées et conçues avec vous, dans le respect de votre style, de votre morphologie et de l’esprit de l’événement.

Du fil à l’émotion, chaque geste est maîtrisé, chaque détail compte.  
Un travail d’orfèvre textile, où rien ne se perd, tout se transforme.`,
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

function MainApp() {
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

  const pageTitle = selectedConcept === 'Bienvenue' ? 'Bienvenue | Atelier Dentelles & Costumes' :
                    selectedConcept === 'Boutique' ? 'Boutique | Atelier Dentelles & Costumes' :
                    selectedConcept === 'FAQ 💬 & Contact' ? 'FAQ | Atelier Dentelles & Costumes' :
                    selectedConcept === 'Services' ? 'Services | Atelier Dentelles & Costumes' :
                    selectedConcept === 'Notre histoire' ? 'Notre Histoire | Atelier Dentelles & Costumes' :
                    'Atelier Dentelles & Costumes';

  const pageDescription = selectedConcept === 'Bienvenue' ? 'Découvrez notre atelier de couture sur mesure, dédié à des créations uniques pour mariages et cérémonies.' :
                         selectedConcept === 'Boutique' ? 'Explorez notre boutique de pièces uniques, mariant tradition et innovation.' :
                         selectedConcept === 'FAQ 💬 & Contact' ? 'Consultez notre FAQ et contactez-nous pour plus d’informations.' :
                         selectedConcept === 'Services' ? 'Découvrez nos services de retouches, créations sur-mesure et plus.' :
                         selectedConcept === 'Notre histoire' ? 'Apprenez-en plus sur l’histoire et la mission de notre atelier.' :
                         'Atelier Dentelles & Costumes – Créations uniques et personnalisées.';

  return (
    <div className="app-wrapper">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="/images/Logo-light.svg" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Menu 
        concepts={concepts} 
        onConceptClick={handleConceptChange} 
        activeLink={activeLink} 
        className="menu-hidden"
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
          <a className="clickable" href="https://www.instagram.com/atelier_dentelles_et_costumes?igsh=aG05dzZibjFxN3po">Instagram</a>
          <a className="clickable" href="https://www.facebook.com/share/15pUDc96q9/">Facebook</a>
        </div>
      </div>
    </div>
  );
}

export default function AtelierApp() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-calendar" element={<AdminCalendar />} /> {/* ✅ La nouvelle page admin */}
        
        <Route path="/" element={<MainApp />} />
        <Route path="/admin" element={<AdminBoutique />} />
      </Routes>
    </Router>
  );
}
