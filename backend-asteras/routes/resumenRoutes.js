import express from "express";
import { getResumenMensual, getProductoMasVendido } from "../controllers/resumenController.js";
const router = express.Router();

router.get("/mensual", getResumenMensual);
router.get("/producto-mas-vendido", getProductoMasVendido);

export default router;