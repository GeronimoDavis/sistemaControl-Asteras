import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: false
});

// Funciones para categorías de productos
export const getCategoriasProductos = () => API.get('/categoriaProductos');
export const createCategoriaProducto = (nombre) => API.post('/categoriaProductos', { nombre });
export const updateCategoriaProducto = (id, nombre) => API.put(`/categoriaProductos/${id}`, { nombre });

// Funciones para categorías de gastos
export const getCategoriasGastos = () => API.get('/categoriaGastos');
export const createCategoriaGasto = (nombre) => API.post('/categoriaGastos', { nombre });
export const updateCategoriaGasto = (id, nombre) => API.put(`/categoriaGastos/${id}`, { nombre });

//funciones de Productos

export const  getAllProductos = () => API.get("/productos");
export const getProductoById = (id) => API.get(`productos/${id}`);
export const createProducto = (productoData) => API.post("/productos",productoData);
export const updateProducto = (id, productoData) => API.put(`productos/${id}`, productoData);
export const updateStock = (id, stock) => API.patch(`/productos/${id}/stock`, { stock });

//funciones de ventas
export const getAllVentas = () => API.get("/ventas");
export const getVentaById = (id) => API.get(`/ventas/${id}`)
export const createVentas = (ventaData) => API.post ("/ventas", ventaData);
export const updateVentas = (id, ventaData) => API.put(`/ventas/${id}`, ventaData);

//funciones de gastos 
export const getAllGastos = () => API.get("/gastos");
export const getGastoByid = (id) => API.get(`/gastos/${id}`)
export const createGasto = (gastoData) => API.post(`/gastos`, gastoData);
export const updateGastos = (id, gastoData) => API.put(`/gastos/${id}`, gastoData);

//funciones de resumen
export const getResumenMensual = (mes, anio) => API.get("/resumen/mensual", { params: { mes, anio } });
export const getProductoMasVendido = (mes, anio) => API.get("/resumen/producto-mas-vendido", { params: { mes, anio } });
export const getTopCategoriaGastos = (mes, anio) => API.get("/resumen/top-gastos-categorias", { params: { mes, anio } });

export default API;