import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import '../App.css';

export function PaginaCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [recuperado, setRecuperado] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: '',
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaEditandoId, setCategoriaEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const mostrarFormularioHandler = () => {
    setMostrarFormulario((prevMostrarFormulario) => !prevMostrarFormulario);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/categoria');
        const data = await response.json();
        setCategorias(data);
        setRecuperado(true);
      } catch (error) {
        console.error('Error al recuperar datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setNuevaCategoria({
      ...nuevaCategoria,
      [e.target.name]: e.target.value,
    });
  };

  const handleCrearProducto = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categoria/crear/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaCategoria),
      });

      if (response.ok) {
        const nuevoProductoCreado = await response.json();
        setCategorias([...categorias, nuevoProductoCreado]);
        setNuevaCategoria({
          nombre: '',
        });
        setMostrarFormulario(false);
      } else {
        console.error('Error al crear la categoría:', response.statusText);
      }
    } catch (error) {
      console.error('Error al crear la categoría:', error);
    }
  };

  const handleEliminarProducto = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/categoria/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setCategorias(categorias.filter((prod) => prod.id !== id));
      } else {
        console.error('Error al eliminar la categoría:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
    }
  };

  const handleEditarProducto = (id) => {
    setModoEdicion(true);
    setCategoriaEditandoId(id);
    const productToEdit = categorias.find((prod) => prod.id === id);
    if (productToEdit) {
      setNuevaCategoria({ ...productToEdit });
      setMostrarFormulario(true);
    }
  };

  const handleCancelarEdicion = () => {
    setModoEdicion(false);
    setCategoriaEditandoId(null);
    setNuevaCategoria({
      nombre: '',
    });
    setMostrarFormulario(false);
  };

  const handleActualizarDesdeFormulario = () => {
    handleActualizarProducto(categoriaEditandoId, nuevaCategoria);
    handleCancelarEdicion();
  };

  const handleActualizarProducto = async (id, updatedProduct) => {
    try {
      const response = await fetch(`http://localhost:8000/api/categoria/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        const updatedProductData = await response.json();
        setCategorias(categorias.map((prod) => (prod.id === id ? updatedProductData : prod)));
      } else {
        console.error('Error al actualizar la categoría:', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
    }
  };

  const mostrarTabla = () => (
    <div className="container mt-4">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Código</th>
            <th>Categoria</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.nombre}</td>
              <td>
                <FontAwesomeIcon
                  icon={faFilePen}
                  className="icono mx-2"
                  onClick={() => handleEditarProducto(prod.id)}
                  style={{ cursor: 'pointer' }}
                />
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="icono mx-2"
                  onClick={() => handleEliminarProducto(prod.id)}
                  style={{ cursor: 'pointer' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mt-4">
      <h1 className="mt-3">Tabla Categorias</h1>

      <div className="card mt-3">
        <div className="card-body">
          <h2 className="mb-4">{modoEdicion ? 'Editar Categoria' : 'Crear Categoria'}</h2>
          <button type="button" className="btn btn-danger mb-3" onClick={mostrarFormularioHandler}>
            {mostrarFormulario ? 'Ocultar Formulario' : 'Abrir Formulario'}
          </button>

          {mostrarFormulario && (
            <form className="row g-3">
              <div className="col-md-6">
                <label htmlFor="nombre" className="form-label my-3">
                  Nombre:
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="form-control"
                  value={nuevaCategoria.nombre}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-12 mt-3">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={modoEdicion ? handleActualizarDesdeFormulario : handleCrearProducto}
                >
                  {modoEdicion ? 'Actualizar' : 'Crear Categoria'}
                </button>
                {modoEdicion && (
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={handleCancelarEdicion}
                  >
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
