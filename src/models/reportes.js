const mongoose = require("mongoose"); // importando el componente mogoose
const reporteSchema = mongoose.Schema({
    tipoReporte: {
        type: String,
        required: true,
    },
    fechaCreacion: {
        type: Date,
        requiered: true,
    }    
});
module.exports = mongoose.model("Reporte", reporteSchema);
