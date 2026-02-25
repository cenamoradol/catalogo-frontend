import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalogo from './pages/Catalogo';
import Proveedor from './pages/Proveedor';
import AdminEliminar from './pages/AdminEliminar';
import ImportarProductos from './pages/ImportarProductos';
import Reportes from './pages/Reportes';

import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/proveedor/:nombreProveedor" element={<Proveedor />} />
          <Route path="/admin/eliminar" element={<AdminEliminar />} />
          <Route path="/admin/importar" element={<ImportarProductos />} />
          <Route path="/admin/reportes" element={<Reportes />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;