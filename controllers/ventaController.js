import Venta from '../models/ventaModel.js';

export const createVenta = async (req, res) => {
    try {
        const { producto, cantidad, precioUnitario } = req.body;

        const nuevaVenta = new Venta({
            producto,
            cantidad,
            precioUnitario
        });

        await nuevaVenta.save();
        res.status(201).json(nuevaVenta);
    } catch (err) {
        res.status(500).json({ message: "Error al crear la venta", error: err.message });
    }
}

export const getAllVentas = async (req, res) => {
    try {
        const ventas = await Venta.find().populate('producto').sort({ fecha: -1 });
        res.status(200).json(ventas);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener las ventas", error: err.message });
    }
}

export const getVentaById = async (req, res) => {
    try{
        const {id} = req.params;
        const venta = await Venta.findById(id).populate('producto');
        if (!venta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        res.status(200).json(venta);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener la venta", error: err.message });
    }
}

export const updateVenta = async (req, res) => {
    try {
        const {id} = req.params;
        const {producto, cantidad, precioUnitario} = req.body;
        const ventaActualizada = await Venta.findByIdAndUpdate(
            id,
            {producto, cantidad, precioUnitario},
            {new: true}
        );
        if (!ventaActualizada) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        res.status(200).json(ventaActualizada);
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar la venta", error: err.message });
    }
}

export const deleteVenta = async (req, res) => {
    try{
        const {id} = req.params;
        const ventaEliminada = await Venta.findByIdAndDelete(id);
        if (!ventaEliminada) {
            return res.status(404).json({ message: "Venta no encontrada" });
        } 

        res.status(200).json({ message: "Venta eliminada exitosamente" });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar la venta", error: err.message });
    }
}