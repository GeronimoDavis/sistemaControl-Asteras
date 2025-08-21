import { useState, useEffect } from "react";
import { getAllVentas, createVentas, updateVentas, getAllProductos} from "../api"

const Ventas = () =>{
    const [ventas, setVentas] = useState([]);
    const [error, setError] = useState("");
    const [editId, setEditId] = useState(null);// id dela venta que estamos editando
    const [formData, setFormData] = useState({
        producto: "",
        cantidad: "", 
        precioUnitario:""
    });
    const [producto, setProducto] = useState([]);

    useEffect(() => {
        const fetchData = async () =>{
            try{
                const resVentas = await getAllVentas();
                setVentas(resVentas.data);

                const res = await getAllProductos();
                setProducto(res.data);
            }catch(err){
                setError("Error al cargar datos");
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) =>{
        const {name, value} = e.target; //extraemos el name del input para saber cuál campo se está editando

        // si selecciona el input producto, setear precioUnitario automaticamente
        if(name === "producto"){
            const prod = producto.find((p) => p._id === value);//se busca dentro del array producto el primer producto cuyo _id coincida con value
            setFormData({
                ...formData,
                producto: value,
                precioUnitario: prod?.precioVenta || ""// si prod existe y no es null entonces usar su propiedad precioVenta
            });
        }else{
            setFormData({
                ...formData,
                [name]: value // esto actualiza la propiedad del objeto que tenga como nombre el name del input, con el valor que se escribe en ese input (value)
            })
        }
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{

            const dataToSend = {
                ...formData,
                cantidad: Number(formData.cantidad),
                precioUnitario: Number(formData.precioUnitario) 
            };
            await createVentas(dataToSend)

            //Refrescamos lista de ventas
            const res = await getAllVentas();
            setVentas(res.data);

            setFormData({producto: "", cantidad: "", precioUnitario: ""});
            
        }catch(err){
            setError("Error al crear la venta");
            console.error(err);
        }
    };

    if (error) return <p>{error}</p>;
    
    return(
        <div>
            <h2>Registrar Venta</h2>
            <form onSubmit={handleSubmit}>
                <select name="producto" 
                    value={formData.producto} 
                    onChange={handleChange} 
                    required>
                
                <option value="">Seleccionar un producto</option>
                {producto.map((p) => (
                    <option key={p._id} value={p._id}>
                        {p.nombre}
                    </option>
                ))}
                </select>

                <input
                    type="number"
                    name="cantidad"
                    placeholder="Cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="precioUnitario"
                    placeholder="Precio unitario"
                    value={formData.precioUnitario}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Registrar</button>

            </form>

            <h2>Lista de ventas</h2>
            {ventas.length === 0 ? (
                <p> No hay ventas registradas</p>
            ):(
                <table border="1" cellPadding="8">
                    <thead>
                        <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Total</th>
                        <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.map((v) => (
                            <tr key={v._id}>
                                <td>{v.producto?.nombre || "No hay producto"}</td>
                                <td>{v.cantidad}</td>
                                <td>{v.precioUnitario}</td>
                                <td>{v.cantidad * v.precioUnitario}</td>
                                <td>{new Date(v.fecha).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default Ventas; 