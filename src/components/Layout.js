import React from 'react';
import { NavLink } from 'react-router-dom';

const Layout = ({ children }) => {
    return (
        <>
            <nav className="navbar">
                <NavLink to="/" className="navbar-brand">
                    <span style={{ color: '#2b6cb0' }}>Catálogo</span>BP
                </NavLink>
                <div className="navbar-links">
                    <NavLink to="/" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        Catálogo
                    </NavLink>
                    <NavLink to="/admin/importar" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        Importar Excel
                    </NavLink>
                    <NavLink to="/admin/reportes" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        Reportes
                    </NavLink>
                    <NavLink to="/admin/eliminar" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        Administrar
                    </NavLink>
                </div>
            </nav>
            <div className="container" style={{ minHeight: 'calc(100vh - 100px)' }}>
                {children}
            </div>
            <footer style={{ textAlign: 'center', padding: '20px', color: '#718096', fontSize: '0.9rem' }}>
                &copy; {new Date().getFullYear()} Catálogo de Productos BP. Todos los derechos reservados.
            </footer>
        </>
    );
};

export default Layout;
