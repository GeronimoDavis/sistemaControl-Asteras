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

const Gasto = mongoose.model('Gasto', GastosSchema);
export default Gasto;