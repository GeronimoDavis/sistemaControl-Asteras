import Categoria from "../models/categoriaGastosModel.js";

export const createCategoriaGasto = async (req, res) => {
  try{
    const {nombre} = req.body;

    const existe = await Categoria.findOne({ nombre });
    if(existe){
        return res.status(400).json({ message: "La categoría del gasto ya existe" });
    }

    const nuevaCategoria = new Categoria({ nombre });
    await nuevaCategoria.save();
    res.status(201).json(nuevaCategoria); 
  }catch(err){
    res.status(500).json({ message: "Error al crear la categoría del gasto", error: err.message });
  }
};

export const getAllCategoriasGastos = async (req, res) => {
    try{
        const categorias = await Categoria.find();
        res.status(200).json(categorias); 
    }catch(err){
        res.status(500).json({ message: "Error al obtener las categorías de los gasto", error: err.message });
    }
}


export const updateCategoriaGasto = async (req, res) => {
    try{
        const {id} = req.params;
        const {nombre} = req.body;
        const existe = await Categoria.findOne({ nombre });
        if(existe && existe._id.toString() !== id){//Si ya existe otro documento con ese nombre y no es el mismo que estoy editando tiro error
            return res.status(400).json({ message: "La categoría del gasto ya existe" });
        }
        const categoria = await Categoria.findByIdAndUpdate(
            id,
            { nombre },
            { new: true }
        );

        res.status(200).json(categoria);
    }catch(err){
        res.status(500).json({ message: "Error al actualizar la categoría del gasto", error: err.message });
    }
}
