
import { useState, useEffect } from "react";
import{
    getCategoriasGastos,
    createCategoriaGasto,
    updateCategoriaGasto,
    getCategoriasProductos,
    createCategoriaProducto,
    updateCategoriaProducto
} from "../api"; 
import "../todoCss/categorias.css";

const Categorias = () => {
    const [tipo, setTipo] = useState("producto");//producto o gasto
    const [nombre, setNombre] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [editId, setEditId] = useState(null);// id de la categoría que estamos editando
    const [error, setError] = useState("");

    // Traer categorías según tipo
    useEffect(() => {
        const fetchCategorias = async () =>{
            try{
                const res = 
                tipo === "producto"
                ? await getCategoriasProductos()
                : await getCategoriasGastos();
            
                // Asegurar que siempre tengamos un array válido
                setCategorias(res?.data || []);//Si res es null o no tiene data, pone un array vacío para evitar errores
                setEditId(null);
                setNombre("");
            }catch(err){
                setError("No se pudo encontrar las categorias");
                console.error(err);
                setCategorias([]); // En caso de error, establecer array vacío
            }

        };
        fetchCategorias();
    }, [tipo]);

    

    //Crear o actualizar categoria
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            console.log("Enviando datos:", { tipo, nombre, editId });
            
            if(editId){// si no es null estamos editando, sino creando
                //editar
                if(tipo === "producto"){
                    await updateCategoriaProducto(editId, nombre);
                }else{
                    await updateCategoriaGasto(editId, nombre);
                }
            }else{
                //crear
                if(tipo === "producto"){
                    await createCategoriaProducto(nombre);
                }else{
                    await createCategoriaGasto(nombre);
                }
            }
            //refrescar lista llamando devuelta al endpoint 
            const res = 
            tipo === "producto"
            ? await getCategoriasProductos()
            : await getCategoriasGastos();
            setCategorias(res?.data || []);
            setNombre("");
            setEditId(null);
        }catch (err) {
            console.error("Error completo:", err);
            console.error("Respuesta del servidor:", err.response);
            console.error("Datos del error:", err.response?.data);
            alert(err.response?.data?.message || "Error al guardar categoría");
        }
    };

    //preparar edicion, se ejecuta para cambiar el  setEditId y que ya no sea null para que el handleSubmit haga su trabajo 
    const handleEdit = (categoria) =>{
        setNombre(categoria.nombre);
        setEditId(categoria._id);
    }

    if(error) return <p>{error}</p>;
    
    return(
    <div className="categorias-container">
      <h2 className="categorias-titulo">Categorías</h2>

      <div className="tipo-selector">
        <h3>Selecciona el tipo de categoría</h3>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              value="producto"
              checked={tipo === "producto"}
              onChange={() => setTipo("producto")}//si es producto cambia el tipo
            />
            <span>Producto</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              value="gasto"
              checked={tipo === "gasto"}
              onChange={() => setTipo("gasto")}//si es gasto cambia el tipo
            />
            <span>Gasto</span>
          </label>
        </div>
      </div>

      <div className="formulario-categoria">
        <h3>{editId ? "Editar Categoría" : "Nueva Categoría"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-grupo">
            <input
              className="input-categoria"
              type="text"
              placeholder="Nombre de la categoría"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}/*cambia el estado del nombre al que se escriba*/
              required//evita enviar el form vacío
            />
            <button type="submit" className="btn-principal">
              {editId ? "Actualizar" : "Guardar"}
            </button>
            {editId && (// render condicional con &&. Si editId existe, se muestra el botón Cancelar
              <button 
                type="button" 
                className="btn-secundario"
                onClick={() => { setEditId(null); setNombre(""); }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="lista-categorias">
        <h3>Categorías de {tipo === "producto" ? "Productos" : "Gastos"}</h3>
        {!categorias || categorias.length === 0 ? (// si no hay categorías (array vacío o undefined), muestra el mensaje “No hay…” si hay muestra la lista
          <p className="mensaje-vacio">No hay categorías disponibles</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {categorias.map((cat) => (// recorre el array y pinta cada categoría.
              <li key={cat._id} className="categoria-item">
                <span className="categoria-nombre">{cat.nombre}</span>
                <button 
                  className="btn-editar"
                  onClick={() => handleEdit(cat)}
                >
                  Editar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    );

};

export default Categorias;