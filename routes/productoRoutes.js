import express from "express";
import { getAllProductos, createProducto, getProductoById, updateProducto, updateStockProducto} from "../controllers/productoController.js";

const router = express.Router();

router.get("/", getAllProductos);
router.post("/", createProducto);
router.get("/:id", getProductoById);
router.put("/:id", updateProducto);
router.patch("/:id/stock", updateStockProducto);

export default router;
