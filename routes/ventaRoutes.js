import express from "express";
import { createVenta, 
        getAllVentas, 
        getVentaById, 
        updateVenta 
} 
from "../controllers/ventaController.js";

const routes = express.Router();

routes.post('/', createVenta);
routes.get('/', getAllVentas);
routes.get('/:id', getVentaById);
routes.put('/:id', updateVenta);


export default routes;