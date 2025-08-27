import { useEffect, useState } from "react";
import {
  getAllGastos,
  getGastoByid,
  createGasto,
  updateGastos,
  getCategoriasGastos,
} from "../api";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resGasto = await getAllGastos();
        setGastos(resGasto.data);

        const resCategoria = await getCategoriasGastos();
        setCategoria(resCategoria.data);
      } catch (err) {
        setError("Error al cargar datos");
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
        setEditId(null);
      } catch (err) {
        setError("Error al editar los datos");
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
        setError("Error al crear registro");
        console.error(err);
      }
    }

    setFormData({
      descripcion: "",
      monto: "",
      categoria: "",
    });
    try {
      const resGasto = await getAllGastos();
      setGastos(resGasto.data);
    } catch (err) {
      setError("Error al cargar datos");
      console.error(err);
    }
  };

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

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Registrar Gasto</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar una categoria</option>
          {categoria.map((c) => (
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
          required
        />

        <input
          type="number"
          name="monto"
          placeholder="Monto"
          value={formData.monto}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editId ? "Actualizar gasto" : "Registrar gasto"}
        </button>
        {editId && (
          <button type="button" className="btn-cancelar" onClick={handleCancel}>
            Cancelar Edición
          </button>
        )}
      </form>

      <h2>lista de gastos</h2>
      <div>
        {gastos.length === 0 ? (
          <p> No hay gastos registradas</p>
        ) : (
          <dic>
            <table className="ventas-table">
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
                {gastos.map((g) => (
                  <tr key={g._id}>
                    <td>{g.descripcion}</td>
                    <td>{g.monto}</td>
                    <th>{g.categoria?.nombre || "No hay categoria"}</th>
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
          </dic>
        )}
      </div>
    </div>
  );
};

export default Gastos;
