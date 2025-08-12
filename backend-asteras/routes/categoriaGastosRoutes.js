import express from 'express';
import { createCategoriaGasto, getAllCategoriasGastos, updateCategoriaGasto } from '../controllers/categoriaGastosController.js';

const routes = express.Router();

routes.post('/', createCategoriaGasto);
routes.get('/', getAllCategoriasGastos);
routes.put('/:id', updateCategoriaGasto);

export default routes;
