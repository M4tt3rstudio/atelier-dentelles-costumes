import React from 'react';
import ReactDOM from 'react-dom/client';
import './AtelierApp.css'; // ton style principal
import AtelierApp from './AtelierApp'; // ton composant principal
import MetaWorldsBackground from './components/MetaWorldsBackground';
import AdminBoutique from './components/AdminBoutique';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MetaWorldsBackground/>
   <AtelierApp/>
   
  </React.StrictMode>
);
