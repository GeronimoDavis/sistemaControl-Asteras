import express from "express";
import { getResumenMensual } from "../controllers/resumenController.js";
const router = express.Router();

router.get("/mensual", getResumenMensual);

export default router;