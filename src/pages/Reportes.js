import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const Reportes = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarProductos = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/productos`);
            // Sort by votes descending (optional, but useful for a report)
            const sortedProducts = res.data.sort((a, b) => b.votos - a.votos);
            setProductos(sortedProducts);
            setError(null);
        } catch (err) {
            console.error('Error al cargar productos para el reporte:', err);
            setError('Error al cargar los datos. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const exportarExcel = () => {
        if (productos.length === 0) return;

        // Prepare data for Excel
        const dataParaExcel = productos.map(p => ({
            'Código': p.codigoproducto,
            'Nombre del Producto': p.nombreproducto,
            'Proveedor': p.proveedor,
            'Precio (LPS)': p.preciolps,
            'Cantidad de Votos': p.votos
        }));

        // Create workbook and worksheet
        const ws = XLSX.utils.json_to_sheet(dataParaExcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Reporte de Votos");

        // Set column widths (optional but nice)
        const wscols = [
            { wch: 15 }, // Código
            { wch: 40 }, // Nombre
            { wch: 25 }, // Proveedor
            { wch: 15 }, // Precio
            { wch: 18 }, // Votos
        ];
        ws['!cols'] = wscols;

        // Save file
        XLSX.writeFile(wb, `Reporte_Votos_Catalogo_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Reporte de Votos</h1>
                <button 
                    onClick={exportarExcel} 
                    className="btn btn-primary"
                    disabled={loading || productos.length === 0}
                    style={{ 
                        backgroundColor: '#2b6cb0', 
                        padding: '10px 20px', 
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    📊 Descargar Excel
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <div className="loader">Cargando datos...</div>
                </div>
            ) : error ? (
                <div style={{ backgroundColor: '#fff5f5', color: '#c53030', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                    {error}
                </div>
            ) : (
                <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '15px' }}>Código</th>
                                <th style={{ textAlign: 'left', padding: '15px' }}>Producto</th>
                                <th style={{ textAlign: 'left', padding: '15px' }}>Proveedor</th>
                                <th style={{ textAlign: 'center', padding: '15px' }}>Votos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((p) => (
                                <tr key={p.codigoproducto} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px 15px' }}>{p.codigoproducto}</td>
                                    <td style={{ padding: '12px 15px', fontWeight: 500 }}>{p.nombreproducto}</td>
                                    <td style={{ padding: '12px 15px' }}>{p.proveedor}</td>
                                    <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                        <span style={{ 
                                            backgroundColor: '#ebf8ff', 
                                            color: '#2b6cb0', 
                                            padding: '4px 12px', 
                                            borderRadius: '20px', 
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem'
                                        }}>
                                            ❤️ {p.votos}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {productos.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#718096' }}>
                                        No hay productos disponibles para mostrar en el reporte.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Reportes;
