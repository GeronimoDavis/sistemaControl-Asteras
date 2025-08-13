import { Link } from 'react-router-dom';
import "../todoCss/navbar.css"

export default function Navbar() {
  return(
    <nav className='navbar'>
      <div className='contenedor-navbar'>
        <h1 className='logo'>Sistema Asteras</h1>
        <ul className='nav-links'>
        <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/categorias">Categorías</Link></li>
          <li><Link to="/stock">Stock</Link></li>
          <li><Link to="/ventas">Ventas</Link></li>
          <li><Link to="/gastos">Gastos</Link></li>
          <li><Link to="/resumen">Resumen</Link></li>
        </ul>

      </div>
    </nav>
  )

}
