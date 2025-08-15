import { useState, useEffect } from "react";
import { getAllProductos} from "../api";
import "../todoCss/stock.css";

const Stock = () =>{
    const[productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    

    //traemos el stock
    useEffect(() =>{
        const fetchStock = async () =>{
            try{
                const res = await getAllProductos();
                setProductos(res.data || []);
                
            }catch(error){
                console.error("Error al obtener productos", error);
            }
        };
        fetchStock();
    },[]);// el segundo parametro [] significa que solo se ejecuta una vez cuando el componente se monta

    //filtrar por nombre

    const productosFiltrados = productos.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return(
        <div className="stock-container">
            <h2 className="stock-titulo">Stock de Productos</h2>

            <div className="busqueda-container">
                <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}/*se actualiza busqueda con lo que haya en el input*/
                className="input-busqueda"/>
            </div>

      {productosFiltrados.length === 0 ? (
        <p className="mensaje-vacio">No hay productos que coincidan</p>
      ) : (
        <table className="tabla-stock">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Stock</th>
              <th>Precio Compra</th>
              <th>Precio Venta</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p._id}>
                <td>{p.nombre}</td>
                <td>{p.stock}</td>
                <td>${p.precioCompra}</td>
                <td>${p.precioVenta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    );
}

export default  Stock;