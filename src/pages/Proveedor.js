import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Proveedor = () => {
  const { nombreProveedor } = useParams();
  const [productos, setProductos] = useState([]);

  const cargarProductos = async () => {
    try {
      const res = await axios.get(`https://catalogo-backend-w8ys.onrender.com/?proveedor=${encodeURIComponent(nombreProveedor)}`);
      setProductos(res.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [nombreProveedor]);

  const handleVotar = async (codigoProducto) => {
    const votos = JSON.parse(localStorage.getItem('votos') || '{}');
    if (votos[codigoProducto]) return;

    try {
      await axios.post(`https://catalogo-backend-w8ys.onrender.com/votar/${codigoProducto}`);
      votos[codigoProducto] = true;
      localStorage.setItem('votos', JSON.stringify(votos));
      cargarProductos(); // actualiza sin recargar
    } catch (error) {
      console.error('Error al votar:', error);
    }
  };

  const handleDesvotar = async (codigoProducto) => {
    const votos = JSON.parse(localStorage.getItem('votos') || '{}');
    if (!votos[codigoProducto]) return;

    try {
      await axios.post(`https://catalogo-backend-w8ys.onrender.com/desvotar/${codigoProducto}`);
      delete votos[codigoProducto];
      localStorage.setItem('votos', JSON.stringify(votos));
      cargarProductos(); // actualiza sin recargar
    } catch (error) {
      console.error('Error al quitar voto:', error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Productos de {nombreProveedor}</h2>
      {productos.length === 0 ? (
        <p>No se encontraron productos para este proveedor.</p>
      ) : (
        productos.map((p) => (
          <ProductCard
            key={p.codigoProducto}
            producto={p}
            onVotar={handleVotar}
            onDesvotar={handleDesvotar}
          />
        ))
      )}
    </div>
  );
};

export default Proveedor;