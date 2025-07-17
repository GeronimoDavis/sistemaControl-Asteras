import mongoose from 'mongoose';

const CategoriaSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        unique: true
    },
    tipo:{
        type: String,
        enum: ['Ingreso', 'Egreso'],
        required: true
    }

})

const Categoria = mongoose.model("Categoria", CategoriaSchema);
export default Categoria;