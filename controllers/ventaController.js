import Venta from '../models/ventaModel.js';
import Producto from '../models/productoModel.js';
import mongoose from 'mongoose';

export const createVenta = async (req, res) => {
    try {
        const { producto, cantidad, precioUnitario } = req.body;

        //validaciones
        if(!producto || !mongoose.Types.ObjectId.isValid(producto)){
            return res.status(400).json({ message: "ID de producto no válido" });   
        }

        if(cantidad == null || isNaN(cantidad) || cantidad <= 0 || !Number.isInteger(cantidad)){
            return res.status(400).json({ message: "La cantidad es obligatoria y debe ser un número entero mayor a 0" });
        }

        if(precioUnitario == null || isNaN(precioUnitario) || precioUnitario < 0){
            return res.status(400).json({ message: "El precio unitario es obligatorio y debe ser un número mayor o igual a 0" });
        }

        const productoExiste = await Producto.findById(producto);
        if (!productoExiste) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        //validar que el stock sea suficiente
        if( productoExiste.stock < cantidad) {
            return res.status(400).json({ message: "Stock insuficiente" });
        }


        const nuevaVenta = new Venta({
            producto,
            cantidad,
            precioUnitario
        });

        await nuevaVenta.save();

        //actualizar el stock del producto
        productoExiste.stock -= cantidad;
        await productoExiste.save();

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
        //validaciones
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "ID de venta no válido" });
        }
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
        //validaciones

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "ID de venta no válido" });
        }

        if(!producto || !mongoose.Types.ObjectId.isValid(producto)){
            return res.status(400).json({ message: "ID de producto no válido" });
        }

        if(cantidad == null || isNaN(cantidad) || cantidad <= 0 || !Number.isInteger(cantidad)){
            return res.status(400).json({ message: "La cantidad es obligatoria y debe ser un número entero mayor a 0" });
        }

        if(precioUnitario == null || isNaN(precioUnitario) || precioUnitario < 0){
            return res.status(400).json({ message: "El precio unitario es obligatorio y debe ser un número mayor o igual a 0" });
        }

        //venta original
        const ventaOriginal = await Venta.findById(id);
        if (!ventaOriginal) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        //producto original(antes de editarlo)
        const productoOriginal = await Producto.findById(ventaOriginal.producto);
        if(!productoOriginal) {
            return res.status(404).json({ message: "Producto original no encontrado" });
        }

        //producto nuevo(el que llega por el body)
        const productoNuevo = await Producto.findById(producto);
        if (!productoNuevo) {
            return res.status(404).json({ message: "Producto nuevo no encontrado" });
        }

        //si se quiere cambiar el producto, reponemos el stock del producto anterior
        if(producto !== ventaOriginal.producto.toString()) {
            productoOriginal.stock += ventaOriginal.cantidad;

            //verificamos que el stock del nuevo producto sea suficiente
            if(productoNuevo.stock < cantidad){
                return res.status(400).json({ message: "Stock insuficiente del nuevo producto" });
            }

            productoNuevo.stock -= cantidad;//descontamos el stock del nuevo producto
        }else{
            //si es el mismo producto hacemos la diferencia de stock 
            const diferencia = cantidad - ventaOriginal.cantidad;

            if(diferencia > 0){
                //si la diferencia es positiva le restamos esta al producto
                if(productoNuevo.stock < diferencia){
                    return res.status(400).json({ message: "No hay stock suficiente para aumentar la cantidad" });
                }
                productoNuevo.stock -= diferencia;
            }else if(diferencia < 0){
                productoNuevo.stock += Math.abs(diferencia); // Math.abs retorna el valor absoluto de un numero(este siempre es positivo)
            }
        }
         // Guardamos los cambios de stock
        await productoOriginal.save();
        await productoNuevo.save();

         // Guardamos los cambios de stock
        ventaOriginal.producto = producto;
        ventaOriginal.cantidad = cantidad;
        ventaOriginal.precioUnitario = precioUnitario;
        await ventaOriginal.save();

        res.status(200).json(ventaOriginal);
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar la venta", error: err.message });
    }
}
