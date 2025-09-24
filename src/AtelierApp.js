import React, { useState, useEffect, useRef } from 'react';

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

import AdminCalendar from './components/AdminCalendar';

/* === Hook simple : fixe une variable --vh à l'init (pas de resize) === */
function useMobileViewportFix() {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh(); // init seulement
    window.addEventListener('orientationchange', setVh);
    return () => window.removeEventListener('orientationchange', setVh);
  }, []);
}

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
      images: ['/depot-vente-1.jpg', '/depot-vente-2.jpg', '/depot-vente-3.jpg']
    },
    icon: FaCut,
  },
  { label: 'Boutique', detail: {}, icon: FaStore },
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
      images: [
        'retouches-&-création-1.jpg',
        'retouches-&-création-2.jpg',
        'retouches-&-création-3.jpg'
      ]
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
  useMobileViewportFix();

  const [conceptDetails, setConceptDetails] = useState(defaultWelcomeDetail);
  const [selectedConcept, setSelectedConcept] = useState('Bienvenue');
  const [activeLink, setActiveLink] = useState('Bienvenue');
  const [filter, setFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('toutes');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [refreshBoutique, setRefreshBoutique] = useState(false);

  // Mesure dynamique de la hauteur du header -> CSS var --header-h
  useEffect(() => {
    const setHeaderVar = () => {
      const header = document.querySelector('.main-header');
      if (!header) return;
      const h = header.offsetHeight || 64;
      document.documentElement.style.setProperty('--header-h', `${h}px`);
    };
    setHeaderVar();
    const headerEl = document.querySelector('.main-header');
    const ro = headerEl ? new ResizeObserver(setHeaderVar) : null;
    if (ro && headerEl) ro.observe(headerEl);
    window.addEventListener('resize', setHeaderVar);
    return () => {
      window.removeEventListener('resize', setHeaderVar);
      if (ro) ro.disconnect();
    };
  }, []);

  // replie le header dès qu’on descend un peu
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setHeaderCollapsed(y > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const detailRef = useRef(null);

  // détecte mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener ? mq.addEventListener('change', update) : mq.addListener(update);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', update) : mq.removeListener(update);
    };
  }, []);

  // scroll utilitaire (offset = header)
  const scrollDetailToTopMobile = () => {
    if (!isMobile) return;
    const el = detailRef.current;
    if (!el) return;

    let offset = 0;
    const header = document.querySelector('.main-header');
    if (header) {
      const pos = getComputedStyle(header).position;
      if (pos === 'fixed' || pos === 'sticky') offset = header.offsetHeight;
    }
    const y = Math.max(0, Math.floor(el.getBoundingClientRect().top + window.pageYOffset - offset));
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // 🔁 Scroll “anti-raté” : réessaie pendant que la grille/images se posent
  const forceScrollToDetail = (maxRetries = 6, delayMs = 90) => {
    let tries = 0;
    const tick = () => {
      if (!isMobile) return;
      scrollDetailToTopMobile();
      tries += 1;
      if (tries < maxRetries) setTimeout(tick, delayMs);
    };
    requestAnimationFrame(() => requestAnimationFrame(tick));
  };

  // ✅ Collapse + scroll vers "Notre histoire" (mobile)
  const collapseAndScrollToNotreHistoire = () => {
    if (!isMobile) return;

    const header = document.querySelector('.main-header');
    const logo = header?.querySelector('.logo-image');
    const target = document.getElementById('btn-notre-histoire');
    if (!target) return;

    const doScroll = () => {
      const offset = header ? header.offsetHeight : 0;
      const y = Math.floor(target.getBoundingClientRect().top + window.pageYOffset - offset - 4);
      window.scrollTo({ top: y, behavior: 'smooth' });
    };

    setHeaderCollapsed(true);

    if (headerCollapsed) {
      requestAnimationFrame(() => requestAnimationFrame(doScroll));
      return;
    }

    const waitEl = logo || header;
    if (!waitEl) {
      setTimeout(doScroll, 260);
      return;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      waitEl.removeEventListener('transitionend', finish);
      requestAnimationFrame(() => requestAnimationFrame(doScroll));
    };

    const cs = getComputedStyle(waitEl);
    const dur = (cs.transitionDuration || '0s').split(',')[0].trim();
    const del = (cs.transitionDelay || '0s').split(',')[0].trim();
    const durMs = (parseFloat(dur) || 0) * (dur.endsWith('ms') ? 1 : 1000);
    const delMs = (parseFloat(del) || 0) * (del.endsWith('ms') ? 1 : 1000);
    if (durMs + delMs === 0) {
      finish();
      return;
    }

    waitEl.addEventListener('transitionend', finish);
    setTimeout(finish, durMs + delMs + 80);
  };

  // 👉 Scroll fiable vers Boutique
  useEffect(() => {
    if (!isMobile) return;
    if (selectedConcept !== 'Boutique') return;
    forceScrollToDetail(7, 100);
  }, [selectedConcept, isMobile, refreshBoutique]);

  // 👉 Mode "overlay" pour Notre histoire (image plein écran + texte/pagination au-dessus)
  useEffect(() => {
    if (!isMobile) return;
    const panel = document.querySelector('#detail-panel');
    if (!panel) return;

    // Nettoyage quel que soit l’état précédent
    panel.classList.remove('story-overlay-mode');
    const previousCover = panel.querySelector('.chapter-cover');
    if (previousCover) previousCover.classList.remove('chapter-cover');

    if (selectedConcept !== 'Notre histoire') return;

    // Ajoute une classe sur le panel pour activer le CSS d’overlay
    panel.classList.add('story-overlay-mode');

    // Cherche une image à transformer en cover (robuste)
    const img =
      panel.querySelector('.section-panel.story-panel img') ||
      panel.querySelector('.story-fullheight img') ||
      panel.querySelector('img');

    if (img) img.classList.add('chapter-cover');

    // Safety: relance un scroll après paint si on arrive depuis tout en bas
    requestAnimationFrame(() => requestAnimationFrame(scrollDetailToTopMobile));

    // cleanup quand on quitte la section
    return () => {
      panel.classList.remove('story-overlay-mode');
      const cover = panel.querySelector('.chapter-cover');
      if (cover) cover.classList.remove('chapter-cover');
    };
  }, [selectedConcept, isMobile]);

  const handleConceptChange = (detail, key) => {
    const concept = concepts.find(c => c.label === key);
    if (concept) setConceptDetails(concept.detail);
    else if (staticLinks[key]) setConceptDetails(staticLinks[key]);

    setSelectedConcept(key);
    setActiveLink(key);
    setFilter('all');
    setSelectedCategory('toutes');

    if (key === 'Boutique') {
      setRefreshBoutique(true);
      setTimeout(() => setRefreshBoutique(false), 50);
    } else {
      setTimeout(scrollDetailToTopMobile, 60);
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
        return (
          <div className="story-fullheight">
            <OurStory key="OurStory" />
          </div>
        );
      default:
        return <StandardDetails key={selectedConcept} content={conceptDetails} conceptKey={selectedConcept} />;
    }
  };

  const pageTitle =
    selectedConcept === 'Bienvenue' ? 'Bienvenue | Atelier Dentelles & Costumes' :
    selectedConcept === 'Boutique' ? 'Boutique | Atelier Dentelles & Costumes' :
    selectedConcept === 'FAQ 💬 & Contact' ? 'FAQ | Atelier Dentelles & Costumes' :
    selectedConcept === 'Services' ? 'Services | Atelier Dentelles & Costumes' :
    selectedConcept === 'Notre histoire' ? 'Notre Histoire | Atelier Dentelles & Costumes' :
    'Atelier Dentelles & Costumes';

  const pageDescription =
    selectedConcept === 'Bienvenue' ? 'Découvrez notre atelier de couture sur mesure, dédié à des créations uniques pour mariages et cérémonies.' :
    selectedConcept === 'Boutique' ? 'Explorez notre boutique de pièces uniques, mariant tradition et innovation.' :
    selectedConcept === 'FAQ 💬 & Contact' ? 'Consultez notre FAQ et contactez-nous pour plus d’informations.' :
    selectedConcept === 'Services' ? 'Découvrez nos services de retouches, créations sur-mesure et plus.' :
    selectedConcept === 'Notre histoire' ? 'Apprenez-en plus sur l’histoire et la mission de notre atelier.' :
    'Atelier Dentelles & Costumes – Créations uniques et personnalisées.';

  // NE PAS rendre le panneau détail si on est en mobile sur "Bienvenue"
  const showDetailPanel = !(isMobile && selectedConcept === 'Bienvenue');

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

      <div
        className={`main-header ${headerCollapsed ? 'collapsed' : ''}`}
        role="button"
        tabIndex={0}
        onClick={collapseAndScrollToNotreHistoire}
        onKeyDown={(e) => { if (e.key === 'Enter') collapseAndScrollToNotreHistoire(); }}
      >
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

        {showDetailPanel && (
          <div
            id="detail-panel"
            ref={detailRef}
            data-concept={selectedConcept}
            style={{ flex: 2.25 }}
            key={selectedConcept}
            className="fade-in"
          >
            {renderContent()}
            {lightboxImage && (
              <div className="lightbox" onClick={() => setLightboxImage(null)}>
                <img src={lightboxImage} alt="agrandissement" />
              </div>
            )}
          </div>
        )}
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
        <Route path="/admin-calendar" element={<AdminCalendar />} />
        <Route path="/" element={<MainApp />} />
        <Route path="/admin" element={<AdminBoutique />} />
      </Routes>
    </Router>
  );
}
