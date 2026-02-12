import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Proveedor = () => {
  const { nombreProveedor } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/productos?proveedor=${encodeURIComponent(nombreProveedor)}`);
      const sortedProducts = res.data.sort((a, b) => a.nombreproducto.localeCompare(b.nombreproducto));
      setProductos(sortedProducts);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [nombreProveedor]);

  const handleVotar = async (codigoProducto) => {
    // Logic duped from Catalogo.js - ideally should be in a hook or context
    const votos = JSON.parse(localStorage.getItem('votos') || '{}');
    if (votos[codigoProducto]) return;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/productos/votar/${codigoProducto}`);
      votos[codigoProducto] = true;
      localStorage.setItem('votos', JSON.stringify(votos));
      cargarProductos();
    } catch (error) {
      console.error('Error al votar:', error);
    }
  };

  const handleDesvotar = async (codigoProducto) => {
    const votos = JSON.parse(localStorage.getItem('votos') || '{}');
    if (!votos[codigoProducto]) return;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/productos/desvotar/${codigoProducto}`);
      delete votos[codigoProducto];
      localStorage.setItem('votos', JSON.stringify(votos));
      cargarProductos();
    } catch (error) {
      console.error('Error al quitar voto:', error);
    }
  };

  /* ... inside Proveedor component ... */

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('¡Enlace copiado al portapapeles!');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando...</div>;

  return (
    <div>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '10px' }}>Proveedor: <span style={{ color: '#3182ce' }}>{nombreProveedor}</span></h1>
          <p style={{ color: '#718096' }}>Mostrando {productos.length} productos asociados.</p>
        </div>
        <button
          onClick={handleCopyLink}
          className="btn btn-primary"
          style={{ backgroundColor: '#2b6cb0', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          🔗 Copiar Enlace
        </button>
      </div>

      {productos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '1.2rem', color: '#718096' }}>No se encontraron productos para este proveedor.</p>
        </div>
      ) : (
        <div className="grid-products">
          {productos.map((p) => (
            <ProductCard
              key={p.codigoProducto}
              producto={p}
              onVotar={handleVotar}
              onDesvotar={handleDesvotar}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Proveedor;