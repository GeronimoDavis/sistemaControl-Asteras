import ProductoModel from "../models/productoModel.js";
import CategoriaProducto from "../models/categoriaProductoModel.js";


export const createProducto = async (req, res) =>{
    try{
        const { nombre, stock, precioVenta, precioCompra, categoriaProducto } = req.body;
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
        const { nombre, stock, precioVenta, precioCompra, categoriaProducto } = req.body;

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
        const productoActualizado = await ProductoModel.findByIdAndUpdate(id, { stock }, { new: true }).populate('categoriaProducto');
        res.status(200).json(productoActualizado);
    }catch(err){
        res.status(500).json({ message: "Error al actualizar el stock del producto", error: err.message });
    }
}