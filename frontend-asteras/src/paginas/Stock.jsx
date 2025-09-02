import { useState, useEffect } from "react";
import { getAllProductos, updateStock} from "../api";
import "../todoCss/stock.css";

const Stock = () =>{
    const[productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [error, setError] = useState("");
    const [stock, setStock] = useState("");
    const [editId, setEditId] = useState(null)
    

    useEffect(() =>{
        const fetchStock = async () =>{
            try{
                const res = await getAllProductos();
                setProductos(res.data || []);    
            }catch(error){
                const errorMessage = err.response?.data?.message || "Error al cargar el stock";
                setError(errorMessage);
                console.error(error);
            }
        };
        fetchStock();
    },[]);// el segundo parametro [] que solo se ejecuta una vez cuando el componente se monta

    const handleSave = async (id) =>{
      try{
        await updateStock(id, stock);
        setProductos((prev) => prev.map((p) =>//funcion anonima que recibe como parámetro el estado anterior (prev) y devuelve un nuevo array con los productos actualizados
        p._id === id ? {...p, stock} : p)//Si el producto tiene el mismo id que el que estamos editando, creamos una copia de ese producto con el nuevo stock
        );
        setEditId(null);
      }catch(err){
        const errorMessage = err.response?.data?.message || "Error al actualizar el stock"
        setError(errorMessage);
        console.error(err);
      }
    }

    useEffect(() =>{
      if(error){
        const timer = setTimeout(() =>{
          setError("");
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [error])

    const handleEdit = (producto) =>{
      setEditId(producto._id)
      setStock(producto.stock)
    }
    //filtrar por nombre

    const productosFiltrados = productos.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleCancel = () => {
      setEditId("");
      setStock("");
    }

    // productosFiltrados es una variable que se calcula cada vez que el componente se renderiza

    return(
        <div className="stock-container">
          {error && <p className="error-message">{error}</p>}
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
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p._id}>
                <td>{p.nombre}</td>
                <td>{editId === p._id ?(
                  <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}//convierte un string a número entero 
                  className="input-stock"
                />
                ):(
                  p.stock
                )}</td>
                <td>${p.precioCompra}</td>
                <td>${p.precioVenta}</td>
                  {editId === p._id ? (
                    <td>
                      <button
                        onClick={() => handleSave(p._id)}
                        className="btn-guardar"
                      >
                        Guardar
                      </button>
                    </td>
                  ) : (
                    <td>
                      <button
                        onClick={() => handleEdit(p)}
                        className="btn-editar"
                      >
                        Editar
                      </button>
                    </td>
                  )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    );
}

export default  Stock;
