import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import movimientoRoutes from './routes/movimientoRoutes.js';

dotenv.config();//variables del archivo .env

const app = express();//instancia de express
app.use(cors());//usa middleware cors
app.use(express.json());//para que express entienda json

app.use("/api/movimientos", movimientoRoutes);

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
    
