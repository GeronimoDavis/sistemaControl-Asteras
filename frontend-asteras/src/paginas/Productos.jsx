
import { useEffect, useState } from "react";
import { createProducto, 
    updateProducto, 
    getAllProductos,
    getProductoById,
    updateStock, 
    getCategoriasProductos} from "../api";
import "../todoCss/productos.css";

const Productos = () =>{
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState("");
    const [editId, setEditId] = useState(null);// id del producto que estamos editando
    const [formData, setFormData] = useState({
        nombre:"",
        stock: "",
        precioVenta: "",
        precioCompra: "",
        categoriaProducto: ""
    });
    const [categorias, setCategorias] = useState([]);

    // Cargar productos y categorías
    useEffect(() =>  {
        const fetchPoductos = async () =>{
            try{
                const resProductos = await getAllProductos();
                const resCategorias = await getCategoriasProductos();
                setProductos(resProductos.data);
                setCategorias(resCategorias.data);
            }catch(err){
                const errorMessage = err.response?.data?.message || "Error al cargar los productos";
                setError(errorMessage);
                console.error(err);
            }
            
        };

        fetchPoductos();
    }, []);

    const handleSubmit = async (e) =>{
        e.preventDefault();
       
        if(editId){
            //editar
            try{
                await updateProducto(editId, formData);
                setEditId(null);
            }catch(err){
                const errorMessage = err.response?.data?.message || "Error al editar el producto";
                setError(errorMessage);
                console.error(err);
            }

        }else{
            //crear
            try{
                const dataToSend = {
                    ...formData,//Copia todas las propiedades de formData en un nuevo objeto y las propiedades stock, precioCompra y precioVenta se sobrescriben con sus versiones convertidas a número
                    stock: Number(formData.stock),//vienen como string del input, los convertimos a Number
                    precioCompra: Number(formData.precioCompra),
                    precioVenta: Number(formData.precioVenta),
                  };
                await createProducto(dataToSend); 
            }catch(err){
                const errorMessage = err.response?.data?.message || "Error al crear el producto";
                setError(errorMessage);
                console.error(err);
            }
            
        }



        //Reset y recargar productos
        setFormData({
            nombre: "",
            stock: 0,
            precioCompra: 0,
            precioVenta: 0,
            categoriaProducto: "",
        })
        if (!error) {
            try{
                const res = await getAllProductos();
                setProductos(res.data);
            }catch(err){
                const errorMessage = err.response?.data?.message || "Error al recargar los productos";
                setError(errorMessage);
                console.error(err);
            }
        }
      
    }

    useEffect(() => {
        if(error){
            const timer = setTimeout(() => {
                setError("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);
    

    const handleEdit = (producto) =>{
        setEditId(producto._id);
        setFormData({
            nombre: producto.nombre,
            stock: producto.stock,
            precioVenta: producto.precioVenta,
            precioCompra: producto.precioCompra,
            categoriaProducto: producto.categoriaProducto._id//viene como objeto
        });
    }
    
    //simplemente se limpia la informacion 
    const handleCancel = () => {
        setEditId(null);
        setFormData({
            nombre: "",
            stock: "",
            precioCompra: "",
            precioVenta: "",
            categoriaProducto: ""
        });
    };
    
    //actualiza el estado formData cuando se escribe en un input del formulario
    const handleChange = (e) =>{
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };


    return(
        <div className="productos-container">
            {error && <p className="error-message">{error}</p>}

            <h1 className="productos-titulo">{editId ? "Editar Producto" : "Crear Producto"}</h1>
            
            
            <div className="formulario-producto">
                <h3>Información del Producto</h3>
                <form onSubmit={handleSubmit}>
                    <div className="input-grupo">
                        <input
                            className="input-producto"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Nombre del producto"
                            required
                            autocomplete="off"
                        />
                    </div>

                    <div className="input-grupo">
                        <input
                            className="input-producto"
                            name="stock"
                            type="number"
                            value={formData.stock ?? ""}
                            onChange={handleChange}
                            placeholder="Stock disponible"
                            required
                        />

                        <input
                            className="input-producto"
                            name="precioCompra"
                            type="number"
                            step="0.01"
                            value={formData.precioCompra ?? ""}
                            onChange={handleChange}
                            placeholder="Precio de compra"
                            required
                        />

                        <input
                            className="input-producto"
                            name="precioVenta"
                            type="number"
                            step="0.01"//el usuario puede ingresar números decimales con hasta 2 decimales de precisión
                            value={formData.precioVenta ?? ""}
                            onChange={handleChange}
                            placeholder="Precio de venta"
                            required
                        />
                    </div>

                    <div className="input-grupo">
                        <select
                            className="select-categoria"
                            name="categoriaProducto"
                            value={formData.categoriaProducto}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccionar categoría</option>
                            {categorias.map((cat) =>(
                                <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn-principal"
                    >
                        {editId ? "Actualizar Producto" : "Crear Producto"}
                    </button>
                    {editId && (
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={handleCancel}
                        >
                            Cancelar Edición
                        </button>
                    )}
                </form>
            </div>
             
            <div className="lista-productos">
                <h3>Lista de Productos</h3>
                {productos.length === 0 ? (
                    <p className="mensaje-vacio">No hay productos cargados</p>
                ) : (
                    <div>
                        {productos.map((p) =>(
                            <div key={p._id} className="producto-item">
                                <div className="producto-info">
                                    <div className="producto-nombre">{p.nombre}</div>
                                    <div className="producto-detalles">
                                        Stock: {p.stock} | Precio Venta: ${p.precioVenta} | Precio Compra: ${p.precioCompra} | Categoría: {p.categoriaProducto?.nombre || "Sin categoría"}
                                    </div>
                                </div>
                                <button onClick={() => handleEdit(p)} className="btn-editar">Editar</button>
                            </div>
                        ))}
                    </div>
                )} 
            </div>
        </div>
    )
}

export default Productos;