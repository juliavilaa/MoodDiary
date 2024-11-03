const mongoose = require("mongoose"); // importando el componente mogoose
const emocionesSchema = mongoose.Schema({

    nombreEmocion: {
        type: String,
        required: true,
    },

    descripcion: {
        type: String,
        required: true,
    },
    
    fecha: {
        type: Date,
        requiered: true,
    }
});
module.exports = mongoose.model("Emociones", emocionesSchema);

