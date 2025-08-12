import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
   nombre:{
        type: String,
        required: true,
        unique: true
   }, 
   stock:{
        type: Number,
        required: true,
        default: 0
   },
   precioVenta:{
        type: Number,
        required: true
    },
    precioCompra:{
        type: Number,
        required: true
    },
    categoriaProducto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CategoriaProducto",
        required: true
    },
}); 

const Producto = mongoose.model("Producto", productoSchema);
export default Producto;
