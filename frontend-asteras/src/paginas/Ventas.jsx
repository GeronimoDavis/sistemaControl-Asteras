import { useState, useEffect } from "react";
import { getAllVentas, createVentas, updateVentas, getAllProductos} from "../api"
import "../todoCss/ventas.css";

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

    //estados para filtrar

    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);

    const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());

    const [busqueda, setBusqueda] = useState("");


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
        if(editId){
            //editar
            try{
                const dataToSend = {
                    ...formData,
                    cantidad: Number(formData.cantidad),
                    precioUnitario: Number(formData.precioUnitario)
                };
                await updateVentas(editId, dataToSend);
                setEditId(null);

            }catch(err){
                setError("Error al actualizar la venta");
                console.error(err);
            }

        }else{
            try{
                //crear
                const dataToSend = {
                ...formData,
                cantidad: Number(formData.cantidad),
                precioUnitario: Number(formData.precioUnitario) 
                };
                await createVentas(dataToSend)

            }catch(err){
                setError("Error al registrar la venta");
                console.error(err);
            }
        }

           //Refrescamos lista de ventas
           setFormData({producto: "", cantidad: "", precioUnitario: ""});
        try{
            const res = await getAllVentas();
            setVentas(res.data);
        }catch(err){
            setError("Error al cargar datos");
            console.error(err);
        }
           
    };

    const handleEdit = (venta) =>{
        setEditId(venta._id);
        setFormData({
            producto: venta.producto._id,
            cantidad: venta.cantidad,
            precioUnitario: venta.precioUnitario
        });
    }

    const handleCancel = () =>{
        setEditId(null);
        setFormData({
            producto: "",
            cantidad: "",
            precioUnitario: ""
        });
    }

    //Filtros

    const ventasFiltradas = ventas//guardamos el array de ventas en esta nueva variable para aplicarle filtros
    .filter((v) => {
        const fecha = new Date(v.fecha);
        return(
            fecha.getMonth() + 1 === parseInt(mesSeleccionado) &&
            fecha.getFullYear() === parseInt(anioSeleccionado)//comparamos las fehas de los estados con todas las del array hasta que sean iguales
        );
    })
    .filter((v) =>
        v.producto?.nombre?.toLowerCase()
        .includes(busqueda.trim().toLowerCase())//buscamos el producto del input que se guarda en busqueda 
    );

    if (error) return <p>{error}</p>;
    
    return(
        <div className="ventas-container">
            <h2 className="ventas-titulo">Registrar Venta</h2>
            <form onSubmit={handleSubmit} className="form-ventas">
                <select name="producto" 
                    value={formData.producto} 
                    onChange={handleChange} 
                    required
                >
                
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

                <button type="submit">
                    {editId ? "Actualizar venta" : "Registrar venta"}
                </button>
                {editId &&(
                    <button
                    type="button"
                    className="btn-cancelar"
                    onClick={handleCancel}>
                        Cancelar Edición
                    </button>
                )}

            </form>

            <h2 className="ventas-titulo">Lista de ventas</h2>
            
            <div className="filtros-ventas">
                <label>Mes: </label>
                <select
                value={mesSeleccionado}
                onChange={(e) => setMesSeleccionado(Number(e.target.value))}>
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                </select>

                <label>Año: </label>
                <input 
                    type="number" 
                    value={anioSeleccionado}
                    onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
                />

                <label> Buscar: </label>
                <input
                    type="text"
                    placeholder="Producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

            </div>

            {ventasFiltradas.length === 0 ? (
                <p className="mensaje-vacio"> No hay ventas registradas</p>
            ):( <div className="ventas-table-container">
                <table className="ventas-table">
                    <thead>
                        <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Total</th>
                        <th>Fecha</th>
                        <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventasFiltradas.map((v) => (
                            <tr key={v._id}>
                                <td>{v.producto?.nombre || "No hay producto"}</td>
                                <td>{v.cantidad}</td>
                                <td>{v.precioUnitario}</td>
                                <td>{v.cantidad * v.precioUnitario}</td>
                                <td>{new Date(v.fecha).toLocaleString()}</td>
                                <td><button onClick={() => handleEdit(v)} className="btn-editar">Editar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    )
}

export default Ventas; 