import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Catalogo from './pages/Catalogo';
import Proveedor from './pages/Proveedor';
import AdminEliminar from './pages/AdminEliminar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/proveedor/:nombreProveedor" element={<Proveedor />} /> 
        <Route path="/admin/eliminar" element={<AdminEliminar />} />
      </Routes>
    </Router>
  );
}

export default App;