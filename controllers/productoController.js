import ProductoModel from "../models/productoModel.js";
import CategoriaProducto from "../models/categoriaProductoModel.js";
import mongoose from "mongoose";


export const createProducto = async (req, res) =>{
    try{
        const { nombre, stock, precioVenta, precioCompra, categoriaProducto } = req.body;

        //validaciones 
        
        if(!nombre || typeof nombre !== "string" || nombre.trim() === " "){
            return res.status(400).json({ message: "El nombre del producto es obligatorio y debe ser una cadena de texto válida" });
        }

        if(stock == null || isNaN(stock) || stock < 0 || !Number.isInteger(stock)){
            return res.status(400).json({ message: "El stock del producto es obligatorio y debe ser un número entero mayor o igual a 0" });
        }

        if(precioVenta == null || isNaN(precioVenta) || precioVenta < 0){
            return res.status(400).json({ message: "El precio de venta del producto es obligatorio y debe ser un número mayor o igual a 0" });
        }

        if(precioCompra == null || isNaN(precioCompra) || precioCompra < 0){
            return res.status(400).json({ message: "El precio de compra del producto es obligatorio y debe ser un número mayor o igual a 0" });
        }

        if(!categoriaProducto || !mongoose.Types.ObjectId.isValid(categoriaProducto)){
            return res.status(400).json({ message: "ID de la categoría no válido" });
        }

        const existe = await ProductoModel.findOne({ nombre });
        if(existe){
            return res.status(400).json({ message: "El producto ya existe" });
        }
        //verificar si la categoría del producto existe
        const categoriaExiste = await CategoriaProducto.findById(categoriaProducto);
        if(!categoriaExiste){
            return res.status(400).json({ message: "La categoría del producto no existe" });
        }

        const nuevoProducto = new ProductoModel({
            nombre,
            stock,
            precioVenta,
            precioCompra,
            categoriaProducto
        });
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    }catch(err){
        res.status(500).json({ message: "Error en el servidor", error: err.message });
    }
}

export const getAllProductos = async (req, res) => {
    try{
        const productos = await ProductoModel.find().populate('categoriaProducto').sort({ createdAt: -1 });
        res.status(200).json(productos);
    }catch(err){
        res.status(500).json({ message: "Error en el servidor", error: err.message });
    }
}


export const getProductoById = async (req, res) => {
    try{
        const { id } = req.params;
        //validaciones
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "ID de producto no válido" });
        }
        const producto = await ProductoModel.findById(id).populate('categoriaProducto');
        if(!producto){
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(producto);
    }catch(err){
        res.status(500).json({ message: "Error al obtener el producto", error: err.message });
    }
}

export const updateProducto = async (req, res) => {
    try{
        const {id} = req.params;

        //validaciones
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "ID de producto no válido" });
        }

        const { nombre, stock, precioVenta, precioCompra, categoriaProducto } = req.body;

        //validaciones

        if(!nombre || typeof nombre !== "string" || nombre.trim() === " "){
            return res.status(400).json({ message: "El nombre del producto es obligatorio y debe ser una cadena de texto válida" });
        }

        if(stock == null || isNaN(stock) || stock < 0 || !Number.isInteger(stock)){
            return res.status(400).json({ message: "El stock del producto es obligatorio y debe ser un número entero mayor o igual a 0" });
        }
        
        if(precioVenta == null || isNaN(precioVenta) || precioVenta < 0){
            return res.status(400).json({ message: "El precio de venta del producto es obligatorio y debe ser un número mayor o igual a 0" });
        }

        if(precioCompra == null || isNaN(precioCompra) || precioCompra < 0){
            return res.status(400).json({ message: "El precio de compra del producto es obligatorio y debe ser un número mayor o igual a 0" });
        }
        if(!categoriaProducto || !mongoose.Types.ObjectId.isValid(categoriaProducto)){
            return res.status(400).json({ message: "ID de la categoría no válido" });
        }

        const existe = await ProductoModel.findOne({ nombre });
        if(existe && existe._id.toString() !== id){
            return res.status(400).json({ message: "El producto ya existe" });
        }
        //verificar si la categoría del producto existe
        const categoriaExiste = await CategoriaProducto.findById(categoriaProducto);
        if(!categoriaExiste){
            return res.status(400).json({ message: "La categoría del producto no existe" });
        }

        const productoActualizado = await ProductoModel.findByIdAndUpdate(
            id,
            { nombre, stock, precioVenta, precioCompra, categoriaProducto },
            { new: true }
        ).populate('categoriaProducto');

        res.status(200).json(productoActualizado);

    }catch(err){
        res.status(500).json({ message: "Error al actualizar el producto", error: err.message });
    }
}

export const updateStockProducto = async (req, res) =>{
    try{
        const {id} = req.params;
        const { stock } = req.body;
        //validaciones
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "ID de producto no válido" });
        }

        if(stock == null || isNaN(stock) || stock < 0 || !Number.isInteger(stock)){
            return res.status(400).json({ message: "El stock del producto es obligatorio y debe ser un número entero mayor o igual a 0" });
        }
        const productoActualizado = await ProductoModel.findByIdAndUpdate(id, { stock }, { new: true }).populate('categoriaProducto');
        res.status(200).json(productoActualizado);
    }catch(err){
        res.status(500).json({ message: "Error al actualizar el stock del producto", error: err.message });
    }
}

//filtrar productos por categoría
 
export const getProductosByCategoria = async (req, res) => {
  try {
    const { idCategoria } = req.params;
    //validaciones 
    if(!mongoose.Types.ObjectId.isValid(idCategoria)){
        return res.status(400).json({ message: "ID de categoría no válido" });
    }
    const existe = await CategoriaProducto.findById(idCategoria);
    if(!existe){
        return res.status(400).json({ message: "La categoría del producto no existe" });
    }
    const productos = await ProductoModel.find({ categoriaProducto: idCategoria }).populate('categoriaProducto');
    res.status(200).json(productos);


  } catch (error) {
      res.status(500).json({ message: "Error al obtener productos por categoría", error: error.message });
  }
};