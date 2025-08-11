import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Importing routes
import ventaRoutes from './routes/ventaRoutes.js';
import categoriaGastosRoutes from './routes/categoriaGastosRoutes.js';
import gastosRoutes from './routes/gastosRoutes.js';
import categoriaProductoRoutes from './routes/categoriaProductoRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import resumenRoutes from './routes/resumenRoutes.js';

dotenv.config();//variables del archivo .env

const app = express();//instancia de express
app.use(cors({
    origin: "http://localhost:5173",//frontend permitido
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]

}));//usa middleware cors
app.use(express.json());//para que express entienda json

// Routes
app.use("/api/categoriaGastos", categoriaGastosRoutes);
app.use("/api/ventas", ventaRoutes);//rutas de ventas
app.use("/api/gastos", gastosRoutes);//rutas de gastos
app.use("/api/categoriaProductos", categoriaProductoRoutes);//rutas de categorias de productos
app.use("/api/productos", productoRoutes);//rutas de productos
app.use("/api/resumen", resumenRoutes);//rutas de resumen mensual

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");//conexión a la base de datos exitosa
        app.listen(PORT, () => {
            console.log(`ºServidor corriendo en puerto ${PORT}`);//inicializa el servidor en el puerto especificado
        });
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });
    
