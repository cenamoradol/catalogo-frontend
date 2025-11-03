import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Catalogo from './pages/Catalogo';
import Proveedor from './pages/Proveedor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/proveedor/:nombreProveedor" element={<Proveedor />} />
      </Routes>
    </Router>
  );
}

export default App;