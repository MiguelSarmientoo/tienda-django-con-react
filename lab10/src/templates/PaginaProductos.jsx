import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export function PaginaProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [recuperado, setRecuperado] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    descripcion: '',
    precio: 0,
    categoria: {},
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditandoId, setProductoEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const mostrarFormularioHandler = () => {
    setMostrarFormulario((prevMostrarFormulario) => !prevMostrarFormulario);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosResponse = await fetch('http://localhost:8000/api/producto');
        const productosData = await productosResponse.json();
        setProductos(productosData);

        const categoriasResponse = await fetch('http://localhost:8000/api/categoria');
        const categoriasData = await categoriasResponse.json();
        setCategorias(categoriasData);

        setRecuperado(true);
      } catch (error) {
        console.error('Error al recuperar datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.name === 'categoria' ? e.target.value : e.target.value,
    });
  };

  const handleCrearProducto = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/producto/crear/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (response.ok) {
        const nuevoProductoCreado = await response.json();
        setProductos([...productos, nuevoProductoCreado]);
        setNuevoProducto({
          descripcion: '',
          precio: 0,
          categoria: {},
        });
        setMostrarFormulario(false); 
      } else {
        console.error('Error al crear el producto:', response.statusText);
      }
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };

  const handleEliminarProducto = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/producto/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setProductos(productos.filter((prod) => prod.id !== id));
      } else {
        console.error('Error al eliminar el producto:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const handleEditarProducto = (id) => {
    setModoEdicion(true);
    setProductoEditandoId(id);
    const productToEdit = productos.find((prod) => prod.id === id);
    if (productToEdit) {
      setNuevoProducto({ ...productToEdit });
      setMostrarFormulario(true); 
    }
  };

  const handleCancelarEdicion = () => {
    setModoEdicion(false);
    setProductoEditandoId(null);
    setNuevoProducto({
      descripcion: '',
      precio: 0,
    });
    setMostrarFormulario(false);
  };

  const handleActualizarDesdeFormulario = () => {
    handleActualizarProducto(productoEditandoId, nuevoProducto);
    handleCancelarEdicion();
  };

  const handleActualizarProducto = async (id, updatedProduct) => {
    try {
      const response = await fetch(`http://localhost:8000/api/producto/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        const updatedProductData = await response.json();
        setProductos(productos.map((prod) => (prod.id === id ? updatedProductData : prod)));
      } else {
        console.error('Error al actualizar el producto:', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  };

  const mostrarTabla = () => (
    <div className="container mt-4">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.descripcion}</td>
              <td>{prod.precio}</td>
              <td>{prod.categoria_nombre}</td>
              <td>
                <FontAwesomeIcon icon={faFilePen} className="icono mx-2" onClick={() => handleEditarProducto(prod.id)} style={{ cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrashCan} className="icono mx-2" onClick={() => handleEliminarProducto(prod.id)} style={{ cursor: 'pointer' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mt-4">
      <h1 className="mt-3">Productos</h1>

      <div className="card mt-3">
        <div className="card-body">
          <h2 className="mb-4">{modoEdicion ? 'Editar Producto' : 'Ingresar Producto'}</h2>
          <button type="button" className="btn btn-danger mb-3" onClick={mostrarFormularioHandler}>
            {mostrarFormulario ? 'Ocultar Formulario' : 'Abrir Formulario'}
          </button>

          {mostrarFormulario && (
            <form className="row g-3">
              <div className="col-md-6">
                <label htmlFor="descripcion" className="form-label my-3">
                  Nombre:
                </label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  className="form-control"
                  value={nuevoProducto.descripcion}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="precio" className="form-label my-3">
                  Precio:
                </label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  className="form-control"
                  value={nuevoProducto.precio}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="categoria" className="form-label my-3">
                  Categoría:
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  className="form-select"
                  value={nuevoProducto.categoria || ''}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
                >
                  <option value="" disabled>
                    Seleccione una categoría
                  </option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 mt-3">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={modoEdicion ? handleActualizarDesdeFormulario : handleCrearProducto}
                >
                  {modoEdicion ? 'Actualizar' : 'Crear Producto'}
                </button>
                {modoEdicion && (
                  <button type="button" className="btn btn-secondary ms-2" onClick={handleCancelarEdicion}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      {recuperado ? mostrarTabla() : <div className="mt-3">Recuperando datos...</div>}
    </div>
  );
}
