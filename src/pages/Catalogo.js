import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [proveedorFiltro, setProveedorFiltro] = useState('');

  const cargarProductos = async () => {
    const url = proveedorFiltro
      ? `https://catalogo-backend-w8ys.onrender.com/productos?proveedor=${encodeURIComponent(proveedorFiltro)}`
      : 'https://catalogo-backend-w8ys.onrender.com/productos';

    const res = await axios.get(url);
    setProductos(res.data);
  };

  const cargarProveedores = async () => {
    const res = await axios.get('https://catalogo-backend-w8ys.onrender.com/productos/proveedores');
    setProveedores(res.data);
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [proveedorFiltro]);

  const handleVotar = async (codigoProducto) => {
    const votos = JSON.parse(localStorage.getItem('votos') || '{}');
    if (votos[codigoProducto]) return;

    await axios.post(`https://catalogo-backend-w8ys.onrender.com/productos/votar/${codigoProducto}`);
    votos[codigoProducto] = true;
    localStorage.setItem('votos', JSON.stringify(votos));
    cargarProductos();
  };

  const handleDesvotar = async (codigoProducto) => {
    const votos = JSON.parse(localStorage.getItem('votos') || '{}');
    if (!votos[codigoProducto]) return;

    await axios.post(`https://catalogo-backend-w8ys.onrender.com/productos/desvotar/${codigoProducto}`);
    delete votos[codigoProducto];
    localStorage.setItem('votos', JSON.stringify(votos));
    cargarProductos();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Catálogo de Productos</h1>

      <label>Filtrar por proveedor:</label>
      <select
        value={proveedorFiltro}
        onChange={(e) => setProveedorFiltro(e.target.value)}
        style={{ marginLeft: 10 }}
      >
        <option value="">Todos</option>
        {proveedores.map((prov, idx) => (
          <option key={idx} value={prov}>{prov}</option>
        ))}
      </select>

      <div style={{ marginTop: 20 }}>
        {productos.map((p) => (
          <ProductCard
            key={p.codigoProducto}
            producto={p}
            onVotar={handleVotar}
            onDesvotar={handleDesvotar}
          />
        ))}
      </div>
    </div>
  );
};


export default Catalogo;