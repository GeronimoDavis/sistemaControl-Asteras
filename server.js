import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import movimientoRoutes from './routes/movimiento.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/movimientos", movimientoRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`ºServidor corriendo en puerto ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });
    
    