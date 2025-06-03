import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function BoutiqueDetails({
  filter,
  setFilter,
  selectedCategory,
  setSelectedCategory,
  setLightboxImage,
  refreshTrigger
}) {
  const [articles, setArticles] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [refreshTrigger]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Erreur chargement articles :", error);
    } else {
      setArticles(data);
    }
  };

  const categories = [
    'toutes',
    ...Array.from(new Set(articles.map(item => item.categorie).filter(Boolean)))
  ];

  const filteredArticles = articles.filter(item => {
    const matchType = filter === 'all' || item.type === filter;
    const matchCat = selectedCategory === 'toutes' || item.categorie === selectedCategory;
    return matchType && matchCat;
  });

  return (
    <div className="section-panel">
      <div className="section-title sticky-title">
        <h2>Détail - Boutique</h2>
      </div>

      <div className="boutique-controls">
        <button
          className={`clickable ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tous
        </button>
        <button
          className={`clickable ${filter === 'vente' ? 'active' : ''}`}
          onClick={() => setFilter('vente')}
        >
          Vente
        </button>
        <button
          className={`clickable ${filter === 'location' ? 'active' : ''}`}
          onClick={() => setFilter('location')}
        >
          Location
        </button>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-dropdown"
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="boutique-gallery">
        {filteredArticles.map(item => (
          <div
            key={item.id}
            className="boutique-item"
            onClick={() => {
              if (!isMobile) {
                setLightboxImage(item.image_url);
              }
            }}
            style={{ cursor: isMobile ? 'default' : 'pointer' }}
          >
            <img src={item.image_url} alt={item.titre} />
            <h3>{item.titre}</h3>
            <p>{item.description}</p>
            <p><strong>{item.prix} €</strong></p>
            {item.categorie && <p className="categorie">Catégorie : {item.categorie}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
