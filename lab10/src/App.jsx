import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { PaginadeInicio } from './templates/PaginadeInicio'
import { PaginaCategorias } from './templates/PaginaCategorias'
import { PaginaProductos } from './templates/PaginaProductos'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="/home" element={<PaginadeInicio />} />
          <Route path='/productos' element={<PaginaProductos/>} />
          <Route path='/categorias' element={<PaginaCategorias/>} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App