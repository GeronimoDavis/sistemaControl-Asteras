import { useEffect, useState } from "react";
import {
  getAllGastos,
  getGastoByid,
  createGasto,
  updateGastos,
  getCategoriasGastos,
} from "../api";
import "../todoCss/gastos.css";

const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: "",
    monto: "",
    categoria: "",
  });
  const [categoria, setCategoria] = useState([]);

  //estados para filtrar
    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);

    const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());

    const [busqueda, setBusqueda] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const resGasto = await getAllGastos();
        setGastos(resGasto.data);

        const resCategoria = await getCategoriasGastos();
        setCategoria(resCategoria.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Error al cargar datos";
        setError(errorMessage);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      try {
        const data = {
          ...formData,
          monto: parseFloat(formData.monto),
        };

        await updateGastos(editId, data);

      } catch (err) {
        const errorMessage = err.response?.data?.message || "Error al editar los datos";
        setError(errorMessage);
        console.error(err);
      }
    } else {
      try {
        const data = {
          ...formData,
          monto: parseFloat(formData.monto),
        };

        await createGasto(data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Error al crear registro";
        setError(errorMessage);
        console.error(err);
      }

    }
    setFormData({
      descripcion: "",
      monto: "",
      categoria: "",
    });
    setEditId(null); // Limpiar el editId para salir del modo edición
    
    // Actualizar la lista de gastos después de crear o editar
    try {
      const resGasto = await getAllGastos();
      setGastos(resGasto.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al cargar datos";
      setError(errorMessage);
      console.error(err);
    }
  };

  useEffect(() => {
    if(error){
      const timer = setTimeout(() =>{
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleEdit = (gasto) => {
    setEditId(gasto._id);
    setFormData({
      descripcion: gasto.descripcion,
      monto: gasto.monto,
      categoria: gasto.categoria?._id,
    });
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({
      descripcion: "",
      monto: "",
      categoria: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    //Filtros

    const gastosFiltrados = gastos
    .filter((g) => {
        const fecha = new Date(g.fecha);
        return(
            fecha.getMonth() + 1 === parseInt(mesSeleccionado) &&
            fecha.getFullYear() === parseInt(anioSeleccionado)
        );
    })
    .filter((g) =>
        g.descripcion?.toLowerCase().includes(busqueda.trim().toLowerCase()) ||//accede a la descripcion de gasto y con include comprueba si lo que se escribio  contiene la cadena de búsqueda 
        g.categoria?.nombre?.toLowerCase().includes(busqueda.trim().toLowerCase())
    );


  return (
    <div className="gastos-container">
      {error && <p className="error-message">{error}</p>}
      <h2 className="gastos-titulo">Registrar Gasto</h2>
      <form onSubmit={handleSubmit} className="formulario-gasto">
        <div className="input-grupo">
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="select-gasto"
            required
          >
            <option value="">Seleccionar una categoria</option>
            {categoria && Array.isArray(categoria) && categoria.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="descripcion"
            placeholder="Descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="input-gasto"
            required
            autocomplete="off"
          />

          <input
            type="number"
            name="monto"
            placeholder="Monto"
            value={formData.monto}
            onChange={handleChange}
            className="input-gasto"
            required
          />
        </div>

        <button type="submit" className="btn-principal">
          {editId ? "Actualizar gasto" : "Registrar gasto"}
        </button>
        {editId && (
          <button type="button" className="btn-cancelar" onClick={handleCancel}>
            Cancelar Edición
          </button>
        )}
      </form>

      <div className="filtros-gasto">
        <h3>Filtrar Gastos</h3>
        <div className="input-grupo">
          <label>Mes: </label>
          <select
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(Number(e.target.value))}
            className="select-gasto"
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
            className="input-filtro"
          />

          <label> Buscar: </label>
          <input
            type="text"
            placeholder="Descripción o Categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-filtro"
          />
        </div>
      </div>

      <div className="lista-gastos">
        <h3>Lista de Gastos</h3>
        {gastosFiltrados.length === 0 ? (
          <p className="mensaje-vacio">No hay gastos registrados</p>
        ) : (
          <div>
            <table className="gastos-table">
              <thead>
                <tr>
                  <th>Descripcion</th>
                  <th>Monto</th>
                  <th>Categoria</th>
                  <th>Fecha</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {gastosFiltrados.map((g) => (
                  <tr key={g._id}>
                    <td>{g.descripcion}</td>
                    <td>{g.monto}</td>
                    <td>{g.categoria?.nombre || "No hay categoria"}</td>
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
    </div>
  );
};

export default Gastos;
