import Venta from "../models/ventaModel.js";
import Gastos from "../models/gastosModel.js";
import Producto from "../models/productoModel.js";


//array de meses para que el sistema no devuelva el mes y no un número
const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre"
];

export const getResumenMensual = async (req, res) => {
    try {
        let {mes, anio} = req.query;
        mes = parseInt(mes);// mes de 1 a 12
        anio = parseInt(anio);
        
        if(!mes ||!anio || mes < 1 || mes > 12 || !Number.isInteger(mes) || !Number.isInteger(anio)) {
            res.status(400).json({message: "Mes y año válidos son requeridos"})
        }
        //rango de fechas
        const mesInicio = new Date(anio, mes - 1, 1);// mes de 0 a 11
        const mesFin = new Date(anio, mes, 0, 23, 59, 59);

        //obtener las ventas del mes 
        const ventas = await Venta.find({
            fecha:{
                $gte: mesInicio,
                $lte: mesFin
            }//gte = mayor o igual, lte = menor o igual
        });

        const totalVentas = ventas.reduce((acc, venta) => acc + (venta.precioUnitario * venta.cantidad) , 0);//El reduce() recorre todas las ventas y acumula ese valor en acc, que empieza en 0

        //obtener los gastos del mes 
        const gastos = await Gastos.find({
            fecha:{
                $gte: mesInicio,
                $lte: mesFin
            }
        });
        const totalGastos = gastos.reduce((acc, gasto) => acc + gasto.monto, 0);


        res.status(200).json({
            mes: meses[mes - 1],
            anio,
            totalVentas,
            totalGastos,
            ganancias: totalVentas - totalGastos
        })

    }catch(err) {
        res.status(500).json({ message: "Error al obtener el resumen mensual", error: err.message });
    }
}

export const getProductoMasVendido = async (req, res) => {
    try{
        let {mes, anio} = req.query;
        mes = parseInt(mes);
        anio = parseInt(anio);

        if(!mes || !anio || mes < 1 || mes > 12 || !Number.isInteger(mes) || !Number.isInteger(anio)){
            return res.status(400).json({message: "Mes y año válidos son requeridos"})
        }

        const mesInicio = new Date(anio, mes - 1, 1);
        const mesFin = new Date(anio, mes, 0, 23, 59, 59);

          // Agregamos pipeline de agregación para MongoDB

          const resultado = await Venta.aggregate([
            { $match: { fecha: { $gte: mesInicio, $lte: mesFin}}},//filtra las ventas cuya fecha esté entre el mesInicio y el mesFin
            { $group: {
                _id: "$producto",
                cantidadTotal: { $sum: "$cantidad"}      
            }},//agrupa las ventas por producto y suma la cantidad de cada producto
            { $sort: { cantidadTotal: -1}},//ordena los productos de mayor a menor cantidad
            { $limit: 1},//limita el resultado a 1 producto
            { $lookup:{
                from: "productos",
                localField: "_id",
                foreignField: "_id",
                as: "producto"
            }},//realiza una unión con la colección de productos para obtener la información del producto en un array
            { $unwind: "$producto"},//desestructura el array producto y lo convierte en un objeto para poder acceder a sus propiedades con el .
            { $project: {
                _id: 0,//excluye el campo _id de mongo
                productoId: "$producto._id",
                nombre: "$producto.nombre",
                cantidadTotal: 1//muestra también la cantidad total (ya estaba calculada en el $group)
            }},//proyecta los campos que se van a devolver
          ]);

          if(resultado.length === 0){
            return res.status(404).json({message: "No se encontraron ventas en el mes especificado"})
          }
          res.status(200).json(resultado[0]);//devuelve el producto más vendido y usamos [0] porque es un array de un solo elemento
    }catch(err){
        res.status(500).json({message: "Error al obtener el producto más vendido", error: err.message});
    }
}
