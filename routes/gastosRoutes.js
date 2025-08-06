import { createGasto, deleteGasto, getAllGastos, getGastoById, updateGasto } from "../controllers/gastosController.js";
import express from "express";

const routes = express.Router();

routes.post('/', createGasto);
routes.get('/', getAllGastos);
routes.get('/:id', getGastoById);
routes.put('/:id', updateGasto);
routes.delete('/:id', deleteGasto);

export default routes;