import { createCategoriaProducto, getAllCategoriasProductos, updateCategoriaProducto } from "../controllers/categoriaProductoController.js";
import express from "express";

const routes = express.Router();

routes.post("/", createCategoriaProducto);
routes.get("/", getAllCategoriasProductos);
routes.put("/:id", updateCategoriaProducto);

export default routes;