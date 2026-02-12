import React, { useState } from 'react';

const ProductCard = ({ producto, onVotar, onDesvotar }) => {
  const { nombreproducto, proveedor, preciolps, imagenurl, codigoproducto, votos } = producto;
  const votosLocal = JSON.parse(localStorage.getItem('votos') || '{}');
  const yaVotado = votosLocal[codigoproducto];
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (yaVotado) {
      onDesvotar(codigoproducto);
    } else {
      onVotar(codigoproducto);
    }
  };

  return (
    <>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ cursor: 'pointer', marginBottom: '15px', overflow: 'hidden', borderRadius: '5px', aspectRatio: '4/3', position: 'relative' }} onClick={() => !imageError && setShowModal(true)}>
          {!imageError && imagenurl ? (
            <img
              src={`${process.env.REACT_APP_API_URL}${imagenurl}`}
              alt={codigoproducto}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#fed7d7',
              color: '#c53030',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              border: '2px dashed #feb2b2'
            }}>
              <span style={{ fontSize: '1.5rem' }}>504</span>
              <span>error</span>
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px', color: '#2d3748' }}>{nombreproducto}</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span style={{ color: '#718096' }}>Código:</span>
            <span style={{ fontWeight: 600 }}>{codigoproducto}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span style={{ color: '#718096' }}>Proveedor:</span>
            <span style={{ fontWeight: 600 }}>{proveedor}</span>
          </div>

          <div style={{ marginTop: '15px', marginBottom: '15px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3182ce' }}>
              L. {Number(preciolps).toLocaleString('es-HN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#718096' }}>
            <span title="Votos">❤️ {votos}</span>
          </div>

          <button
            onClick={handleClick}
            className={`btn ${yaVotado ? 'btn-danger' : 'btn-primary'}`}
            style={{ fontSize: '0.85rem' }}
          >
            {yaVotado ? 'Quitar voto' : 'Votar'}
          </button>
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowModal(false)}>
          <div style={{ position: 'relative', maxWidth: '800px', maxHeight: '90vh' }}>
            <img
              src={`${process.env.REACT_APP_API_URL}${imagenurl}`}
              alt={codigoproducto}
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                borderRadius: '8px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            />
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;