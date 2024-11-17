const mongoose = require("mongoose"); // importando el componente mongoose
const bcrypt = require("bcrypt"); // importando el componente bcrypt
const userSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    clave: {
        type: String,
        required: true
    }, 
    edad: {
        type: Number,
        required: true
    },
    emociones: [{type: mongoose.Schema.Types.ObjectId, ref: 'Emociones'}],
    metas: [{type: mongoose.Schema.Types.ObjectId,ref: 'Metas'}]
});
userSchema.methods.encryptClave = async (clave) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(clave, salt);
}
module.exports = mongoose.model('Usuario', userSchema);
