const express = require("express");
const router = express.Router(); //manejador de rutas de express
const userSchema = require("../models/usuarios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("./validate_token");
const emocionesSchema= require("../models/Emociones");


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
    const token = jwt.sign({ id: usuario._id }, process.env.SECRET, {
        expiresIn: 60 * 60 * 24, //un día en segundos
    });
    res.json({
        error: null,
        data: "Bienvenido(a)",
        auth: true,
        token,
    });
});



router.put("/:id", verifyToken, (req, res) => {
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

  router.get("/",verifyToken,(req, res) => {
    userSchema
      .find()
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });

  router.put("/:id", async (req, res) =>{
    const {id}=req.params;
    const emocion = emocionesSchema(req.body);
    var idEmocion= null;

    const emocionConsulta = await emocionesSchema.findOne({nombreEmocion: req.body.nombreEmocion});
    if(!emocionConsulta){
        await emocion.save().then((dataEmociones) => {
            idEmocion = dataEmociones._id;
        });
    }else {
        idEmocion=emocionConsulta._id;
    }

    userSchemaSchema
    .updateOne({_id: id}, {
        //$push >> agrega un nuevo elemento sin mportar si ya existe
        //$addToSet >> agrega un nuevo elemento sin repetirlo
        $push:{emociones: idEmocion}
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({message: error}));
});


module.exports = router;
