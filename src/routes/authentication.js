const express = require("express");
const router = express.Router(); //manejador de rutas de express
const userSchema = require("../models/usuarios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/signup", async (req, res) => {
    const { nombre, correo, clave, edad} = req.body;
    const usuario = new userSchema({
        nombre: nombre,
        correo: correo,
        clave: clave,
        edad: edad
    });
    usuario.clave = await usuario.encryptClave(usuario.clave);
    await usuario.save(); 
    const token = jwt.sign({ id: usuario._id }, process.env.SECRET, {
        expiresIn: 60 * 60 * 24, //un día en segundos
    });
    res.json({
        auth: true,
        token,
    });
});

//inicio de sesión
router.post("/login", async (req, res) => {
    // validaciones
    const { error } = userSchema.validate(req.body.correo, req.body.clave);
    if (error) return res.status(400).json({ error: error.details[0].message });
    //Buscando el usuario por su dirección de correo
    const usuario = await userSchema.findOne({ correo: req.body.correo });
    //validando si no se encuentra
    if (!usuario) return res.status(400).json({ error: "Usuario no encontrado" });
    //Transformando la contraseña a su valor original para 
    //compararla con la clave que se ingresa en el inicio de sesión
    const validPassword = await bcrypt.compare(req.body.clave, usuario.clave);
    if (!validPassword)
        return res.status(400).json({ error: "Clave no válida" });
    res.json({
        error: null,
        data: "Bienvenido(a)",
    });
});



router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, correo, clave, edad } = req.body;
    userSchema
      .updateOne(
        { _id: id },
        {
          $set: { nombre, correo, clave, edad },
        }
      )
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });

module.exports = router;
