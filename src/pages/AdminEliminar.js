import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminEliminar = () => {
  const [productos, setProductos] = useState([]);

  const cargarProductos = async () => {
    try {
      const res = await axios.get('https://catalogo-backend-w8ys.onrender.com/productos');
      setProductos(res.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm('¿Seguro que deseas eliminar este producto?');
    if (!confirmacion) return;

    try {
      await axios.delete(`https://catalogo-backend-w8ys.onrender.com/productos/${id}`);
      alert('Producto eliminado correctamente');
      cargarProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar producto');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Administración - Eliminar Productos</h2>
      {productos.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        productos.map((p) => (
          <div key={p.id} style={{ borderBottom: '1px solid #ccc', padding: 10 }}>
            <strong>{p.nombreproducto}</strong> - {p.proveedor} - L.{p.preciolps}
            <button
              style={{
                marginLeft: 10,
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer'
              }}
              onClick={() => handleEliminar(p.id)}
            >
              Eliminar
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminEliminar;