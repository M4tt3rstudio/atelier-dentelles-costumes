import React from 'react';
import './MetaWorldsBackground.css';

const MetaWorldsBackground = () => {
  return (
    <div
      className="BG-Container"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Background-Image.png)` }}
    />
  );
};

export default MetaWorldsBackground;
