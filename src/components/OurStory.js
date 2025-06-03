import React, { useState } from 'react';
import './OurStory.css';

const pages = [
  {
    title: 'Chapitre I — 1. Des débuts cousus de passion',
    text: `Couturière de métier, diplômée et passionnée depuis toujours, j’ai longtemps mis mon savoir-faire au service des autres. J’ai affiné mes gestes, appris les secrets des belles étoffes et cousu des rêves dans les coulisses de boutiques de robes de mariée.`,
    image: 'story-1.jpg'
  },
  {
    title: 'Chapitre II —  L’évidence après les années',
    text: `Après plusieurs années passées à voir ces merveilles portées une seule fois puis oubliées, une réflexion s’est imposée à moi. Pourquoi tant de beauté pour un seul instant ? Et pourquoi ne pas leur offrir une seconde vie ?`,
    image: 'story-2.jpg'
  },
  {
    title: 'Chapitre III — Un choix de cœur et de sens',
    text: `Portée par une conscience écologique et un besoin d’authenticité, j’ai décidé que rien ne devait se perdre : chaque dentelle, chaque tissu, chaque idée pouvait se transformer, se recycler, renaître autrement.`,
    image: 'story-3.jpg'
  },
  {
    title: 'Chapitre IV — La liberté de créer',
    text: `J’ai donc créé mon propre atelier. Un espace où les contraintes s’effacent, où chaque pièce raconte une histoire. Ici, je donne vie à mes propres créations : uniques, poétiques, sans limites.`,
    image: 'story-4.jpg'
  },
  {
    title: 'Chapitre V — Un univers à faire grandir',
    text: `Mon souhait aujourd’hui : faire durer ce monde que je tisse jour après jour. Un univers où l’élégance rime avec conscience, où l’artisanat devient une manière d’habiter le monde autrement.

`,
    image: 'story-5.jpg'
  }
];

export default function OurStory() {
  const [current, setCurrent] = useState(0);

  const nextPage = () => {
    if (current < pages.length - 1) setCurrent(current + 1);
  };

  const prevPage = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const { title, text, image } = pages[current];

  return (
    <div className="our-story-wrapper">
      <div className="page">
        <div className="page-image">
          <img src={`/images/${image}`} alt={title} />
        </div>
        <div className="page-content">
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
      </div>

      <div className="page-controls">
        <button onClick={prevPage} disabled={current === 0}>&laquo; Préc.</button>
        <span>{current + 1} / {pages.length}</span>
        <button onClick={nextPage} disabled={current === pages.length - 1}>Suiv. &raquo;</button>
      </div>
    </div>
  );
}
