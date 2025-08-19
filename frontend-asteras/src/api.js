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

export default API;