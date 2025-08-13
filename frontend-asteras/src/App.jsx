
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//importar componentes y paginas
import Navbar from './componentes/Navbar';
import Productos from "./paginas/Productos";
import Categorias from "./paginas/Categorias";
import Stock from './paginas/Stock';
import Ventas from './paginas/Ventas';
import Gastos from './paginas/Gastos';
import Resumen from './paginas/Resumen';

function App() {

  return (
    <Router>
    <Navbar />
      <Routes>
        <Route path='/productos' element={<Productos/>}/>//el route carga la url /productos
        <Route path='/categorias' element={<Categorias/>}/>
        <Route path="/stock" element={<Stock />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/gastos" element={<Gastos />} />
        <Route path="/resumen" element={<Resumen />} />
      </Routes>
    </Router>
  );
}

export default App
