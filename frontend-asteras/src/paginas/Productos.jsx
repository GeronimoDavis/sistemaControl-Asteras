
import { useEffect, useState } from "react";
import { createCategoriaProducto, 
    updateProducto, 
    getAllProductos,
    getProductoById,
    updateStock } from "../api";

const Productos = () =>{
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState("");

    useEffect(() =>  {
        const fetchPoductos = async () =>{
            try{
                const res = await getAllProductos();
                setProductos(res.data);
            }catch(err){
                setError("Error al cargar los productos");
                console.error(err);
            }
            
        };

        fetchPoductos();
    }, []);

    if (error) return <p>{error}</p>;

    return(
        <div className="contenedor-productos">
            <h2>Lista de productos</h2>
            {productos.length === 0 ? (
                <p>No hay productos cargados</p>
            ) : (
                <table border="1" cellPadding="8">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Stock</th>
                    <th>Precio Venta</th>
                    <th>Precio Compra</th>
                    <th>Categoría</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto._id}>
                      <td>{producto.nombre}</td>
                      <td>{producto.stock}</td>
                      <td>{producto.precioVenta}</td>
                      <td>{producto.precioCompra}</td>
                      <td>{producto.categoriaProducto?.nombre || "Sin categoría"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )} 
        </div>
    )
}

export default Productos;