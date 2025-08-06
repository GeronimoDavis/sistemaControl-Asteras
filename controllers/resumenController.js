import Venta from "../models/ventaModel.js";
import Gastos from "../models/gastosModel.js";


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