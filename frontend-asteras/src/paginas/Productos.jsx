
import { useEffect, useState } from "react";
import { createProducto, 
    updateProducto, 
    getAllProductos,
    getProductoById,
    updateStock, 
    getCategoriasProductos} from "../api";

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
                setError("Error al crear el producto");
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
                setError("Error al editar el producto");
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
                setError("Error al crear el producto");
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
        try{
            const res = await getAllProductos();
            setProductos(res.data);
        }catch(err){
            setError("Error al crear el producto");
            console.error(err);
        }
        
      
    }

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
    
    //actualiza el estado formData cuando se escribe en un input del formulario
    const handleChange = (e) =>{
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };


    if (error) return <p>{error}</p>;

    return(
        <div className="contenedor-productos">
            <h2>{editId ? "Editar Producto" : "Crear Producto"}</h2>/*renderizado condicional*/
            
            <form onSubmit={handleSubmit}>
                <input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre"
                />

                <input
                    name="stock"
                    type="number"
                    value={formData.stock ?? ""}
                    onChange={handleChange}
                    placeholder="Stock"
                />

                <input
                    name="precioCompra"
                    type="number"
                    value={formData.precioCompra ?? ""}
                    onChange={handleChange}
                    placeholder="Precio de Compra"
                />

                <input
                name="precioVenta"
                type="number"
                value={formData.precioVenta ?? ""}
                onChange={handleChange}
                placeholder="Precio de Venta"
                className="border p-2 w-full"
                />

                {/* SELECT de categoría */}
            
                <select
                    name="categoriaProducto"
                    value={formData.categoriaProducto}
                    onChange={handleChange}
                >
                    <option value="">Seleccionar categoria</option>
                    {categorias.map((cat) =>(/*recorre las categorías cargadas del backend y crea una opción por cada una*/
                        <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                    ))}
                </select>
            <button
                type="submit"
            >
                {editId ? "Actualizar" : "Crear"}
            </button>

            </form>
             
            

            <h2>Lista de productos</h2>
            {productos.length === 0 ? (
                <p>No hay productos cargados</p>
            ) : (
                <ul>
                    {productos.map((p)=>(//recorre el array productos
                    //key única para identificar cada elemento de la lista con el _id de mongo
                        <li key={p._id}>
                            <span>
                                {p.nombre} - Stock: {p.stock} - ${p.precioVenta} - ${p.precioCompra} - Cat:{" "}
                                {p.categoriaProducto?.nombre || "Sin categoria"}
                            </span>
                            <button onClick={() => handleEdit(p)}>Editar</button>
                        </li>
                    ))}
                </ul>
            )} 
        </div>
    )
}

export default Productos;