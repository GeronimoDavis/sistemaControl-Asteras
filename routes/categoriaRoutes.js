import express from 'express';
import { createCategoria, getAllCategorias, updateCategoria } from '../controllers/categoriaController.js';

const routes = express.Router();

routes.post('/', createCategoria);
routes.get('/', getAllCategorias);
routes.put('/:id', updateCategoria);

export default routes;
