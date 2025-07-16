import express from 'express';
import { createMovimiento, getAllMovimientos } from '../controllers/movimientoController.js';

const router = express.Router();

router.post("/", createMovimiento); // Ruta para crear un nuevo movimiento
router.get("/", getAllMovimientos); // Ruta para obtener todos los movimientos

export default router;