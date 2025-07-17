import Movimiento from "../models/movimientoModel.js";
import Categoria from "../models/categoriaModel.js";

export const createMovimiento = async (req, res) => {
    try{
        const { tipo, monto, descripcion, categoria, metodoPago, fecha } = req.body;
        //validamos que la categoria exista
        const categoriaExistente = await Categoria.findById(categoria);
        if(!categoriaExistente){
            return res.status(400).json({ message: "La categoría no existe" });
        }

        if(categoriaExistente.tipo !== tipo){
            return res.status(400).json({ message: "La categoría no coincide con el tipo de movimiento" });
        }

        const nuevoMovimiento = new Movimiento({
            tipo,
            monto,
            descripcion,
            categoria,
            metodoPago,
            fecha
        });

        await nuevoMovimiento.save();
        res.status(201).json(nuevoMovimiento);
    }catch(err){
        res.status(500).json({ message: "Error al crear el movimiento", error: err.message });
    }
   
};

export const getAllMovimientos = async (req, res) => {
    try{
        const movimientos = await Movimiento.find()
        .sort({ fecha: -1 })
        .populate("categoria"); //busca la informacion de la categoria en el documento usando la _id y lo reemplaza por el objeto completo
        res.status(200).json(movimientos);
    }catch(err){
        res.status(500).json({ message: "Error al obtener los movimientos", error: err.message });
    }
};

