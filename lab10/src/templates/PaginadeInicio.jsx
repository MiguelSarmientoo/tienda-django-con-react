import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function PaginadeInicio() {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [recuperado, setRecuperado] = useState(false);

  useEffect(() => {
    const fetchProductosDestacados = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/producto');
        const data = await response.json();
        setProductosDestacados(data);
        setRecuperado(true);
      } catch (error) {
        console.error('Error al recuperar productos destacados:', error);
      }
    };

    fetchProductosDestacados();
  }, []);

  return (
    <>
      <div className="container mt-5">
        <div className="text-center">
          <h1 className="mb-4">Bienvenido a TecVentas</h1>
          <p className="lead">
            Explora nuestras increíbles categorías y productos para encontrar exactamente lo que necesitas.
          </p>
          <Link to="/productos" className="btn btn-success me-2">
            Ver Productos
          </Link>
          <Link to="/categorias" className="btn btn-danger">
            Ver Categorías
          </Link>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-center mb-4">Últimos Productos Destacados</h2>
        <div className="row">
          {recuperado ? (
            productosDestacados.map((producto) => (
              <div key={producto.id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{producto.descripcion}</h5>
                    <p className="card-text">{producto.precio}</p>
                    <p className="card-text">{producto.categoria_nombre}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">Recuperando productos destacados...</div>
          )}
        </div>
      </div>
    </>
  );
}
