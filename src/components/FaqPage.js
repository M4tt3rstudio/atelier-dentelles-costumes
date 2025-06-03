import React, { useState, useRef, useEffect } from 'react';
import './FaqPage.css';

const faqData = [
  {
    question: "Quels types de vêtements acceptez-vous en dépôt-vente ?",
    answer: "Nous acceptons des pièces uniques, des vêtements de cérémonie ou des créations artisanales. Contactez-nous pour valider votre pièce.",
  },
  {
    question: "Proposez-vous des créations entièrement sur-mesure ?",
    answer: "Oui ! Nous travaillons main dans la main avec vous pour concevoir une tenue personnalisée à partir de vos envies.",
  },
  {
    question: "Quels sont vos délais de retouche ?",
    answer: "En général entre 1 et 3 semaines ouvrés selon la complexité. Une estimation est toujours donnée à l’accueil.",
  },
  {
    question: "Puis-je venir sans rendez-vous ?",
    answer: "Nous recommandons fortement de prendre rendez-vous pour vous garantir un accueil personnalisé.",
  },
  {
    question: "Travaillez-vous avec des matières écologiques ?",
    answer: "Oui, nous privilégions les tissus upcyclés ou naturels,  quand cela est possible.",
  },
];

export default function FaqPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const wrapperRef = useRef(null);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;

    const handleScroll = () => {
      if (!wrapper) return;
      const { scrollTop, clientHeight, scrollHeight } = wrapper;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShowScrollIndicator(!isAtBottom);
    };

    if (wrapper) {
      wrapper.addEventListener('scroll', handleScroll);
      handleScroll(); // détecte dès le début
    }

    return () => {
      if (wrapper) wrapper.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="faq-wrapper" ref={wrapperRef}>
      <h2 className="faq-title">
        Foire Aux Questions <span className="faq-highlight">& Contact</span>
      </h2>

      <div className="faq-intro text-content">
        <p>
          Bienvenue dans notre espace FAQ. Vous trouverez ici les réponses aux questions les plus fréquentes sur notre fonctionnement, nos services, et notre localisation. Si vous ne trouvez pas votre réponse, contactez-nous directement.
        </p>
      </div>

      <div className="faq-accordion">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question clickable"
              onClick={() => toggleIndex(index)}
            >
              {item.question}
              <span className={`faq-arrow ${activeIndex === index ? 'open' : ''}`}>⌄</span>
            </button>
            <div className={`faq-answer ${activeIndex === index ? 'visible' : ''}`}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="faq-contact text-content">
        <h3>📞 Contact</h3>
        <p>Email : <a href="mailto:contact@atelierdentellesetcostumes.fr">contact@atelierdentellesetcostumes.fr</a></p>
        <p>Téléphone : <a href="tel:+33123456789">01 23 45 67 89</a></p>
        <p>Adresse : 13 route du château 25300 La Cluse et Mijoux</p>
      </div>

      <div className="faq-map">
        <iframe
          title="Localisation Atelier"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2727.6074327975793!2d6.368167576981743!3d46.87109737113175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478dbb70997a4a25%3A0xcedc37e99eb4c295!2s13%20Rte%20du%20Ch%C3%A2teau%2C%2025300%20La%20Cluse-et-Mijoux!5e0!3m2!1sen!2sfr!4v1748945110357!5m2!1sen!2sfr"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: '0.5rem' }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {showScrollIndicator && <div className="scroll-indicator">↓</div>}
    </div>
  );
}
