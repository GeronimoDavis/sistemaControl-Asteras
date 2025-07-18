import express from "express";
import { createVenta, 
        getAllVentas, 
        getVentaById, 
        updateVenta, 
        deleteVenta 
} 
from "../controllers/ventaController.js";

const routes = express.Router();

routes.post('/', createVenta);
routes.get('/', getAllVentas);
routes.get('/:id', getVentaById);
routes.put('/:id', updateVenta);
routes.delete('/:id', deleteVenta);

export default routes;