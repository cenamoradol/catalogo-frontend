import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [proveedorFiltro, setProveedorFiltro] = useState('');

  const cargarProductos = async () => {
    const url = proveedorFiltro
      ? `${process.env.REACT_APP_API_URL}/productos?proveedor=${encodeURIComponent(proveedorFiltro)}`
      : `${process.env.REACT_APP_API_URL}/productos`;

    const res = await axios.get(url);
    const sortedProducts = res.data.sort((a, b) => a.nombreproducto.localeCompare(b.nombreproducto));
    setProductos(sortedProducts);
  };

  const cargarProveedores = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/productos/proveedores`);
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

    await axios.post(`${process.env.REACT_APP_API_URL}/productos/votar/${codigoProducto}`);
    votos[codigoProducto] = true;
    localStorage.setItem('votos', JSON.stringify(votos));
    cargarProductos();
  };

  const handleDesvotar = async (codigoProducto) => {
    const votos = JSON.parse(localStorage.getItem('votos') || '{}');
    if (!votos[codigoProducto]) return;

    await axios.post(`${process.env.REACT_APP_API_URL}/productos/desvotar/${codigoProducto}`);
    delete votos[codigoProducto];
    localStorage.setItem('votos', JSON.stringify(votos));
    cargarProductos();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Catálogo de Productos</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {proveedorFiltro && (
            <Link
              to={`/proveedor/${encodeURIComponent(proveedorFiltro)}`}
              className="btn btn-primary"
              style={{
                marginRight: '10px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#3182ce'
              }}
            >
              🔗 Ver página exclusiva
            </Link>
          )}
          <label style={{ fontWeight: 600, color: '#4a5568' }}>Filtrar:</label>
          <select
            value={proveedorFiltro}
            onChange={(e) => setProveedorFiltro(e.target.value)}
            style={{ minWidth: '200px' }}
          >
            <option value="">Todos los proveedores</option>
            {proveedores.map((prov, idx) => (
              <option key={idx} value={prov}>{prov}</option>
            ))}
          </select>
        </div>
      </div>

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

      {productos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#718096' }}>
          <h3>No se encontraron productos</h3>
          <p>Intenta ajustar los filtros o verifica la conexión.</p>
        </div>
      )}
    </div>
  );
};

export default Catalogo;