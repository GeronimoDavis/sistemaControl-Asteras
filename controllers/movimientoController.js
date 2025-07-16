import Movimiento from "../models/movimientoModel.js";

export const createMovimiento = async (req, res) => {
    try{
        const nuevoMovimiento = new Movimiento(req.body);
        await nuevoMovimiento.save();
        res.status(201).json(nuevoMovimiento);
    }catch(err){
        res.status(500).json({ message: "Error al crear el movimiento", error: err.message });
    }
};

export const getAllMovimientos = async (req, res) => {
    try{
        const movimientos = await Movimiento.find().sort({ fecha: -1 });
        res.status(200).json(movimientos);
    }catch(err){
        res.status(500).json({ message: "Error al obtener los movimientos", error: err.message });
    }
};

