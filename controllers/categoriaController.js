import Categoria from "../models/categoriaModel.js";

export const createCategoria = async (req, res) => {
  try{
    const {nombre, tipo} = req.body;

    const existe = await Categoria.findOne({ nombre, tipo });
    if(existe){
        return res.status(400).json({ message: "La categoría ya existe" });
    }
    
    const nuevaCategoria = new Categoria({ nombre, tipo });
    await nuevaCategoria.save();
    res.status(201).json(nuevaCategoria); 
  }catch(err){
    res.status(500).json({ message: "Error al crear la categoría", error: err.message });
  }
};

export const getAllCategorias = async (req, res) => {
    try{
        const categorias = await Categoria.find();
        res.status(200).json(categorias); 
    }catch(err){
        res.status(500).json({ message: "Error al obtener las categorías", error: err.message });
    }
}


export const updateCategoria = async (req, res) => {
    try{
        const {id} = req.params;
        const {nombre, tipo} = req.body;

        const categoria = await Categoria.findByIdAndUpdate(
            id,
            { nombre, tipo },
            { new: true }
        );

        res.status(200).json(categoria);
    }catch(err){
        res.status(500).json({ message: "Error al actualizar la categoría", error: err.message });
    }
}
