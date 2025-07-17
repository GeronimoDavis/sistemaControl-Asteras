import mongoose from 'mongoose';

const MovimientoSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: ['Ingreso', 'Egreso'],
        required: true
    },
    monto: {
        type: Number,
        required: true
    },
    descripcion:{
        type: String,
        required: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categoria",
        required: true
    },
    metodoPago: {
        type: String,  // Opcional (solo se usa si es ingreso)
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

const Movimiento = mongoose.model('Movimiento', MovimientoSchema);
export default Movimiento;