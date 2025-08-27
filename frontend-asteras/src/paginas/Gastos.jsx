import { useEffect, useState } from "react";
import { 
    createGasto, 
    updateGastos, 
    getAllGastos,
    getGastoByid,
    getCategoriasGastos 
} from "../api";
import "../todoCss/gastos.css";

const Gastos = () => {
    const [gastos, setGastos] = useState([]);
    const [error, setError] = useState("");
    const [editId, setEditId] = useState(null); // id del gasto que estamos editando
    const [formData, setFormData] = useState({
        descripcion: "",
        monto: "",
        categoria: ""
    });
    const [categorias, setCategorias] = useState([]);

    // Estados para filtrar
    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);
    const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
    const [busqueda, setBusqueda] = useState("");

    // Cargar gastos y categorías
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resGastos = await getAllGastos();
                const resCategorias = await getCategoriasGastos();
                setGastos(resGastos.data);
                setCategorias(resCategorias.data);
            } catch (err) {
                setError("Error al cargar los datos");
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        if (editId) {
            // editar
            try {
                const dataToSend = {
                    ...formData,
                    monto: Number(formData.monto)
                };
                await updateGastos(editId, dataToSend);
                setEditId(null);
            } catch (err) {
                setError("Error al editar el gasto");
                console.error(err);
            }
        } else {
            // crear
            try {
                const dataToSend = {
                    ...formData,
                    monto: Number(formData.monto)
                };
                await createGasto(dataToSend); 
            } catch (err) {
                setError("Error al crear el gasto");
                console.error(err);
            }
        }

        // Reset y recargar gastos
        setFormData({
            descripcion: "",
            monto: "",
            categoria: ""
        });
        
        try {
            const res = await getAllGastos();
            setGastos(res.data);
        } catch (err) {
            setError("Error al recargar los gastos");
            console.error(err);
        }
    };

    const handleEdit = (gasto) => {
        setEditId(gasto._id);
        setFormData({
            descripcion: gasto.descripcion,
            monto: gasto.monto,
            categoria: gasto.categoria._id // viene como objeto
        });
    };
    
    const handleCancel = () => {
        setEditId(null);
        setFormData({
            descripcion: "",
            monto: "",
            categoria: ""
        });
    };
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Filtros
    const gastosFiltrados = gastos
        .filter((g) => {
            const fecha = new Date(g.fecha);
            return (
                fecha.getMonth() + 1 === parseInt(mesSeleccionado) &&
                fecha.getFullYear() === parseInt(anioSeleccionado)
            );
        })
        .filter((g) =>
            g.descripcion?.toLowerCase()
                .includes(busqueda.trim().toLowerCase())
        );

    if (error) return <p>{error}</p>;

    return (
        <div className="gastos-container">
            <h1 className="gastos-titulo">{editId ? "Editar Gasto" : "Registrar Gasto"}</h1>
            
            {error && <div className="mensaje-error">{error}</div>}
            
            <div className="formulario-gasto">
                <h3>Información del Gasto</h3>
                <form onSubmit={handleSubmit}>
                    <div className="input-grupo">
                        <input
                            className="input-gasto"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Descripción del gasto"
                            required
                        />
                    </div>

                    <div className="input-grupo">
                        <input
                            className="input-gasto"
                            name="monto"
                            type="number"
                            step="0.01"
                            value={formData.monto}
                            onChange={handleChange}
                            placeholder="Monto del gasto"
                            required
                        />
                    </div>

                    <div className="input-grupo">
                        <select
                            className="select-categoria"
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccionar categoría</option>
                            {categorias.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn-principal"
                    >
                        {editId ? "Actualizar Gasto" : "Registrar Gasto"}
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

            <h2 className="gastos-titulo">Lista de Gastos</h2>
            
            <div className="filtros-gastos">
                <label>Mes: </label>
                <select
                    value={mesSeleccionado}
                    onChange={(e) => setMesSeleccionado(Number(e.target.value))}
                >
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

                <label>Buscar: </label>
                <input
                    type="text"
                    placeholder="Descripción..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {gastosFiltrados.length === 0 ? (
                <p className="mensaje-vacio">No hay gastos registrados</p>
            ) : (
                <div className="gastos-table-container">
                    <table className="gastos-table">
                        <thead>
                            <tr>
                                <th>Descripción</th>
                                <th>Monto</th>
                                <th>Categoría</th>
                                <th>Fecha</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gastosFiltrados.map((g) => (
                                <tr key={g._id}>
                                    <td>{g.descripcion}</td>
                                    <td>${g.monto}</td>
                                    <td>{g.categoria?.nombre || "Sin categoría"}</td>
                                    <td>{new Date(g.fecha).toLocaleString()}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleEdit(g)} 
                                            className="btn-editar"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Gastos;