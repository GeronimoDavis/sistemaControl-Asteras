
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
        <Route path='/' element={
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh', 
            textAlign: 'center',
            padding: '40px',
            margin: '80px auto', // Margen superior para dejar espacio al navbar
            maxWidth: '800px', // Ancho máximo para el contenido
            background: 'linear-gradient(135deg, #2c2c2c, #1a1a1a)', // Degradado oscuro
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
            border: '2px solid #8a2be2', // Borde violeta
            color: '#ffffff', // Texto blanco
            fontFamily: 'Roboto Condensed, sans-serif' // Fuente consistente
          }}>
            <h1 style={{ fontSize: '3em', marginBottom: '20px', color: '#ac6eee', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)' }}>Bienvenido al Sistema de Gestión Asteras</h1>
            <p style={{ fontSize: '1.3em', lineHeight: '1.6', color: '#cccccc' }}>Por favor, utiliza la barra de navegación superior para acceder a las diferentes secciones del sistema. Explora nuestras funciones para gestionar tus productos, categorías, stock, ventas, gastos y resúmenes de manera eficiente.</p>
          </div>
        }/>
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
