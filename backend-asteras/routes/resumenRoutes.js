import express from "express";
import { getResumenMensual, getProductoMasVendido, getTopCategoriaGastos } from "../controllers/resumenController.js";
const router = express.Router();

router.get("/mensual", getResumenMensual);
router.get("/producto-mas-vendido", getProductoMasVendido);
router.get("/top-gastos-categorias", getTopCategoriaGastos);

export default router; 