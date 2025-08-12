import mongoose from 'mongoose';

const CategoriaProductoSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        unique: true
    }
})

const CategoriaProducto = mongoose.model('CategoriaProducto', CategoriaProductoSchema);
export default CategoriaProducto;