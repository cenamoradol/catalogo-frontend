import React, { useState } from 'react';

const ProductCard = ({ producto, onVotar, onDesvotar }) => {
  const { nombreproducto, proveedor, preciolps, imagenurl, codigoproducto, votos } = producto;
  const votosLocal = JSON.parse(localStorage.getItem('votos') || '{}');
  const yaVotado = votosLocal[codigoproducto];
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (yaVotado) {
      onDesvotar(codigoproducto);
    } else {
      onVotar(codigoproducto);
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '20px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      maxWidth: '350px'
    }}>
      <div style={{ cursor: 'pointer' }} onClick={() => setShowModal(true)}>
        <img
          src={`https://catalogo-backend-w8ys.onrender.com${imagenurl}`}
          alt={nombreproducto}
          style={{
            width: '100%',
            borderRadius: '5px'
          }}
        />
      </div>
      <h3>{nombreproducto}</h3>
      <p><strong>Proveedor:</strong> {proveedor}</p>
      <p><strong>Precio:</strong> L.{preciolps}</p>
      <p><strong>Votos:</strong> {votos}</p>
      <button onClick={handleClick}>
        {yaVotado ? 'Quitar voto' : 'Me gusta'}
      </button>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setShowModal(false)}>
          <img
            src={`https://catalogo-backend-w8ys.onrender.com${imagenurl}`}
            alt={nombreproducto}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: '10px',
              boxShadow: '0 0 20px rgba(255,255,255,0.5)'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCard;