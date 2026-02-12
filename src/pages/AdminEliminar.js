import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminEliminar = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/productos`);
      setProductos(res.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm('¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.');
    if (!confirmacion) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/productos/${id}`);
      alert('Producto eliminado correctamente');
      cargarProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar producto');
    }
  };

  /* Existing handleEliminar logic above... */


  const [busqueda, setBusqueda] = useState('');

  /* Existing handleEliminar logic above... */

  // Lógica de filtrado
  const productosFiltrados = productos.filter(p => {
    const termino = busqueda.toLowerCase();
    return (
      p.nombreproducto.toLowerCase().includes(termino) ||
      p.codigoproducto.toLowerCase().includes(termino)
    );
  });

  const handleEliminarTodo = async () => {
    const confirmacion = window.confirm('⚠️ ¡PELIGRO! ⚠️\n\n¿Estás seguro de que deseas ELIMINAR TODOS los productos?\n\nEsta acción borrará todo el catálogo permanentemente y no se puede deshacer.');
    if (!confirmacion) return;

    const confirmacion2 = window.confirm('Última advertencia:\n\nSe borrarán TODOS los datos. ¿Proceder?');
    if (!confirmacion2) return;

    try {
      setLoading(true);
      await axios.delete(`${process.env.REACT_APP_API_URL}/productos/eliminar-todo`);
      alert('Todos los productos han sido eliminados. Se ha limpiado el historial de votos.');
      setProductos([]);
      localStorage.removeItem('votos'); // Limpiar votos locales
    } catch (error) {
      console.error('Error al eliminar todo:', error);
      alert('Error al intentar eliminar todos los productos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Administración - Eliminar Productos</h1>
        {productos.length > 0 && (
          <button
            onClick={handleEliminarTodo}
            className="btn btn-danger"
            style={{ backgroundColor: '#c53030', fontWeight: 'bold' }}
          >
            🗑️ ELIMINAR TODO EL CATÁLOGO
          </button>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o código..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Cargando inventario...</div>
      ) : productos.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <p>No hay productos disponibles.</p>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <p>No se encontraron productos que coincidan con su búsqueda.</p>
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead style={{ backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568' }}>Código</th>
                {/* ... rest of headers ... */}
                <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568' }}>Producto</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568' }}>Proveedor</th>
                <th style={{ padding: '15px', textAlign: 'right', color: '#4a5568' }}>Precio</th>
                <th style={{ padding: '15px', textAlign: 'center', color: '#4a5568' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '15px', fontWeight: '600', color: '#718096' }}>{p.codigoproducto}</td>
                  <td style={{ padding: '15px', fontWeight: '500' }}>{p.nombreproducto}</td>
                  <td style={{ padding: '15px' }}>{p.proveedor}</td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>L. {Number(p.preciolps).toLocaleString('es-HN', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleEliminar(p.id)}
                      style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminEliminar;