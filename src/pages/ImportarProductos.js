import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import './ImportarProductos.css';

const ImportarProductos = () => {
    const [data, setData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
    const fileInputRef = useRef(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const parsePrice = (price) => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            const cleanPrice = price.replace(',', '.').replace(/[^0-9.]/g, '');
            return parseFloat(cleanPrice) || 0;
        }
        return 0;
    };

    const processFile = (file) => {
        if (!file) return;
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const jsonData = XLSX.utils.sheet_to_json(ws);

                if (jsonData.length === 0) {
                    setMessage({ type: 'error', text: 'El archivo Excel está vacío.' });
                    setData([]);
                    return;
                }

                // Normalizar keys a minúsculas para búsqueda insensible a mayúsculas
                const normalizeKey = (row, key) => {
                    const foundKey = Object.keys(row).find(k => k.toLowerCase().trim() === key.toLowerCase());
                    return foundKey ? row[foundKey] : undefined;
                };

                const formattedData = jsonData.map(row => ({
                    proveedor: normalizeKey(row, 'proveedor'),
                    nombreproducto: normalizeKey(row, 'nombreproducto') || normalizeKey(row, 'nombre producto'),
                    codigoproducto: normalizeKey(row, 'codigoproducto') || normalizeKey(row, 'codigo producto'),
                    preciolps: parsePrice(normalizeKey(row, 'preciolps') || normalizeKey(row, 'precio lps'))
                })).filter(item => item.codigoproducto); // Filtrar filas sin código

                if (formattedData.length === 0) {
                    const detectedColumns = jsonData.length > 0 ? Object.keys(jsonData[0]).join(', ') : 'Ninguna';
                    setMessage({
                        type: 'error',
                        text: `No se encontraron productos válidos. Columnas detectadas: [${detectedColumns}]. Esperadas: codigoProducto, nombreProducto, proveedor, precioLPS.`
                    });
                } else {
                    setMessage(null);
                }

                setData(formattedData);
            } catch (error) {
                setMessage({ type: 'error', text: 'Error al procesar el archivo. Asegúrate de que es un Excel válido.' });
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleFileUpload = (e) => {
        processFile(e.target.files[0]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = () => {
        setIsDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            processFile(file);
        } else {
            setMessage({ type: 'error', text: 'Por favor, sube un archivo Excel válido (.xlsx o .xls)' });
        }
    };

    const handleUpload = async () => {
        if (data.length === 0) return;
        setLoading(true);
        setMessage(null);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/productos/importar`, data);
            const { nuevos, actualizados, totalProcesados } = res.data;
            setMessage({
                type: 'success',
                text: `¡Éxito! Procesados: ${totalProcesados}. Nuevos: ${nuevos}. Actualizados: ${actualizados}.`
            });
            setData([]);
            setFileName('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Ocurrió un error al enviar los datos al servidor.' });
        }
        setLoading(false);
    };

    const handleRemoveFile = () => {
        setData([]);
        setFileName('');
        setMessage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSyncImages = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/productos/sincronizar-imagenes`);
            setMessage({
                type: 'success',
                text: `Sincronización completa. Imágenes detectadas: ${res.data.totalImagenes}. Productos actualizados: ${res.data.productosActualizados}.`
            });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Error al sincronizar imágenes.' });
        }
        setLoading(false);
    };

    return (
        <div className="import-container">
            <header className="import-header">
                <h1>Importación Masiva</h1>
                <p>Sube tu archivo Excel para actualizar el catálogo rápidamente</p>
                <button
                    onClick={handleSyncImages}
                    className="btn btn-primary"
                    style={{ marginTop: '20px', backgroundColor: '#3182ce' }}
                    disabled={loading}
                >
                    {loading ? 'Sincronizando...' : '🔄 Sincronizar Imágenes del Servidor'}
                </button>
            </header>

            {!data.length ? (
                <div
                    className={`upload-area ${isDragActive ? 'drag-active' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                >
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        className="file-input"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />

                    <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>

                    <p className="upload-text">Arrastra tu archivo Excel aquí</p>
                    <p className="upload-subtext">o haz clic para explorar tus archivos</p>
                </div>
            ) : (
                <div className="preview-section">
                    <div className="file-selected-info">
                        <div>
                            <span style={{ color: '#718096' }}>Archivo seleccionado: </span>
                            <span className="file-name">{fileName}</span>
                        </div>
                        <button onClick={handleRemoveFile} className="remove-file-btn">
                            Cambiar archivo
                        </button>
                    </div>

                    <div className="actions-bar">
                        <span className="record-count">{data.length} productos detectados</span>
                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="import-btn"
                        >
                            {loading ? 'Procesando...' : 'Confirmar Importación'}
                        </button>
                    </div>

                    <div className="table-container">
                        <table className="preview-table">
                            <thead>
                                <tr>
                                    <th>Proveedor</th>
                                    <th>Producto</th>
                                    <th>Código</th>
                                    <th>Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice(0, 50).map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.proveedor}</td>
                                        <td>{row.nombreproducto}</td>
                                        <td>{row.codigoproducto}</td>
                                        <td>L. {typeof row.preciolps === 'number' ? row.preciolps.toFixed(2) : row.preciolps}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {data.length > 50 && (
                            <div style={{ textAlign: 'center', padding: '10px', color: '#718096', fontStyle: 'italic' }}>
                                ... y {data.length - 50} más.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {message && (
                <div className={`message-box ${message.type}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default ImportarProductos;
