import Gasto from '../models/gastosModel.js';
import Categoria from '../models/categoriaGastosModel.js';
import mongoose from 'mongoose';
export const createGasto = async (req, res) =>{
    try{
        const {descripcion, monto, categoria} = req.body;
        //validaciones

        if(typeof descripcion !== "string" || descripcion.trim() === ""){
            return res.status(400).json({ message: "La descripción del gasto debe ser una cadena de texto válida" });
        }

        if(/^\d+$/.test(descripcion)){
            return res.status(400).json({ message: "La descripción del gasto no puede contener solo números" });
        }

        if(monto == null || isNaN(monto) || monto <= 0){
            return res.status(400).json({ message: "El monto del gasto es obligatorio y debe ser un número mayor a 0" });
        }

        if(!categoria || !mongoose.Types.ObjectId.isValid(categoria)){
            return res.status(400).json({ message: "ID de categoría no válido" });
        }

        const cat = await Categoria.findById(categoria);
        if(!cat){
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        const nuevoGasto = new Gasto({
            descripcion,
            monto,
            categoria
        });
        await nuevoGasto.save();
        res.status(201).json(nuevoGasto);
    }catch(err){
        res.status(500).json({ message: "Error al crear el gasto", error: err.message });
    }
}

export const getAllGastos = async (req, res) => {
    try{
        const gastos = await Gasto.find().populate('categoria').sort({ fecha: -1 });//Reemplaza el ObjectId de la categoría por el objeto completo de la categoría y los ordena por fecha descendente
        res.status(200).json(gastos);
    }catch(err){
        res.status(500).json({ message: "Error al obtener los gastos", error: err.message });
    }
}

export const getGastoById = async (req,res) =>{
    try{
        const {id} = req.params;
        //validaciones
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "ID de gasto no válido" });
        }
        const gasto = await Gasto.findById(id).populate('categoria');
        if(!gasto){
            return res.status(404).json({ message: "Gasto no encontrado" });
        }
        res.status(200).json(gasto);
    }catch(err){
        res.status(500).json({ message: "Error al obtener el gasto", error: err.message });
    }
}

export const updateGasto = async (req, res) => {
    try{
        const {id} = req.params;
        const {descripcion, monto, categoria} = req.body;

        //validaciones
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "ID de gasto no válido" });
        }
        if(/^\d+$/.test(descripcion)){
            return res.status(400).json({ message: "La descripción del gasto no puede contener solo números" });
        }

        if(typeof descripcion !== "string" || descripcion.trim() === ""){
            return res.status(400).json({ message: "La descripción del gasto debe ser una cadena de texto válida" });
        }

        if(monto == null || isNaN(monto) || monto <= 0){
            return res.status(400).json({ message: "El monto del gasto es obligatorio y debe ser un número mayor a 0" });
        }

        if(!categoria || !mongoose.Types.ObjectId.isValid(categoria)){
            return res.status(400).json({ message: "ID de categoría no válido" });
        }

        const cat = await Categoria.findById(categoria);
        if(!cat){
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        const gastoActualizado = await Gasto.findByIdAndUpdate(
            id,
            {descripcion, monto, categoria},
            {new: true}
        ).populate('categoria');

        if(!gastoActualizado){
            return res.status(404).json({ message: "Gasto no encontrado" });
        }
        res.status(200).json(gastoActualizado);
    }catch(err){
        res.status(500).json({ message: "Error al actualizar el gasto", error: err.message });
    }
}

export const deleteGasto = async (req, res) => {
    try{
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "ID de gasto no válido" });
        }

        const gastoEliminado = await Gasto.findByIdAndDelete(id);//si no existe el gasto, devuelve null
        if(!gastoEliminado){
            return res.status(404).json({ message: "Gasto no encontrado" });
        }
        res.status(200).json({ message: "Gasto eliminado exitosamente" });
    }catch(err){
        res.status(500).json({ message: "Error al eliminar el gasto", error: err.message });
    }
}