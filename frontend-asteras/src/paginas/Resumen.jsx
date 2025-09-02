import { useState, useEffect } from "react";
import { getResumenMensual, getProductoMasVendido, getTopCategoriaGastos } from "../api";
import "../todoCss/resumen.css";


const Resumen = () => {
    // Estados para los datos del resumen
    const [resumenMensual, setResumenMensual] = useState(null);
    const [productoMasVendido, setProductoMasVendido] = useState([]);
    const [topGastosCategorias, setTopGastosCategorias] = useState([]);

    // Estados para los filtros de fecha
    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);
    const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());

    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResumenData = async () => {
            try {
                // Llamadas a la API
                const [resumenRes, productoMasVendidoRes, topGastosRes] = await Promise.all([
                    getResumenMensual(mesSeleccionado, anioSeleccionado),
                    getProductoMasVendido(mesSeleccionado, anioSeleccionado),
                    getTopCategoriaGastos(mesSeleccionado, anioSeleccionado)
                ]);

                setResumenMensual(resumenRes.data);
                setProductoMasVendido(productoMasVendidoRes.data);
                setTopGastosCategorias(topGastosRes.data);

            } catch (err) {
                const errorMessage = err.response?.data?.message || "Error al cargar la informacion"
                setError(errorMessage);
            }
            
        };

        fetchResumenData();
    }, [mesSeleccionado, anioSeleccionado]); // Se ejecuta cuando cambian mes o año

    useEffect(()=>{
        const timer = setTimeout(() =>{
            setError("");
        }, 5000)
        return () => clearTimeout(timer);
    })

    return (
        <div className="resumen-container">
            {error && <p className="error-message">{error}</p>}
             <h2 className="resumen-titulo">Resumen Mensual</h2>
              {/* Filtros */}
            <div className="filtros-resumen">
                <label>Mes: </label>
                <select value={mesSeleccionado} onChange={(e) => setMesSeleccionado(e.target.value)}>
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
                onChange={(e) => setAnioSeleccionado(e.target.value)}
                />
            </div>
               {/* Resumen general */}
               {resumenMensual && (
                <div className="resumen-seccion">
                    <h3>Resumen de {resumenMensual.mes} {resumenMensual.anio}</h3>
                    <p><strong>Total Ventas</strong>  ${resumenMensual.totalVentas}</p>
                    <p><strong>Total Gastos</strong> ${resumenMensual.totalGastos}</p>
                    <p><strong>Ganancia:</strong> <span className={resumenMensual.ganancias < 0 ? "ganancia-negativa" : ""}>${resumenMensual.ganancias}</span></p>
                    <p><strong>Promedio de Venta:</strong> ${(resumenMensual.totalVentas / resumenMensual.cantidadDeVentas).toFixed(2)}</p> {/* Se redondea a dos decimales*/}
                </div>
               )}
               {/* Producto más vendido */}
               {productoMasVendido.length > 0 && (
                <div className="resumen-seccion">
                    <h3>Top 5 Productos mas vendidos</h3>
                    <ul>
                        {productoMasVendido.map((producto, i) => (
                            <li key={i}>
                                {producto.nombre} ({producto.cantidadTotal} unidades)
                            </li>
                        ))}
                    </ul>
                </div>
               )}
                {/* Categorías de gastos */}
                {topGastosCategorias.length > 0 && (
                    <div className="resumen-seccion">
                        <h3>Top Categorias de Gastos</h3>
                        <ul>
                            {topGastosCategorias.map((cat, i) => (
                                <li key={i}>
                                    {cat.nombre}: ${cat.totalMonto}
                                </li>
                             ))}
                        </ul>
                    </div>
                )}
        </div>
    );
};

export default Resumen;