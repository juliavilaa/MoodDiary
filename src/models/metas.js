const mongoose = require("mongoose"); // importando el componente mogoose
const metasSchema = mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
   descripcion: {
    type: String,
    required: true,
  },
  fechaInico: {
    type: Date,
    required: false,
  },
  fechaFinalizacion: {
    type: Date,
    required: false,
  },
   estado: {
    type: Boolean,
    required: true,
  },
});
module.exports = mongoose.model("Metas", metasSchema);