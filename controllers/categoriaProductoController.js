import CategoriaProducto from "../models/categoriaProductoModel.js";

export const createCategoriaProducto = async (req, res) =>{
    try{
        const {nombre} = req.body;
        const existe = await CategoriaProducto.findOne({ nombre });
        if(existe){
            return res.status(400).json({ message: "La categoría del producto ya existe" });
        }
        const nuevaCategoria = await CategoriaProducto.create({ nombre });
        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);
    }catch(err){
        res.status(500).json({ message: "Error al crear la categoría del producto", error: err.message });

    }
}

export const getAllCategoriasProductos = async (req, res) => {
    try{
        const categoriaProducto = await CategoriaProducto.find();
        res.status(200).json(categoriaProducto);
    }catch(err){
        res.status(500).json({ message: "Error al obtener las categorías de los productos", error: err.message });
    }
}

export const updateCategoriaProducto = async (req, res) => {
    try{
        const {id} = req.params;
        const {nombre} = req.body;
        const existe = await CategoriaProducto.findOne({ nombre });
        if(existe && existe._id.toString() !== id){//Si ya existe otro documento con ese nombre y no es el mismo que estoy editando tiro error
            return res.status(400).json({ message: "La categoría del producto ya existe" });
        }
        const categoriaActualizada = await CategoriaProducto.findByIdAndUpdate(id, { nombre }, { new: true });
        res.status(200).json(categoriaActualizada);
    }catch(err){
        res.status(500).json({ message: "Error al actualizar la categoría del producto", error: err.message });
    }
}