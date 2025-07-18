import mongoose from 'mongoose';


const GastosSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: true
    },
    monto: {
        type: Number,
        required: true
    },
    categoria:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    fecha:{
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Gasto', GastosSchema);