const express = require("express");
const router = express.Router(); //manejador de rutas de express
const userSchema = require("../models/usuarios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("./validate_token");
const emocionesSchema= require("../models/Emociones");
const  metasSchema= require("../models/metas");
const Emociones = require("../models/Emociones");


router.post("/signup", async (req, res) => {
  const { nombre, correo, clave, edad } = req.body;
  const usuario = new userSchema({
    nombre: nombre,
    correo: correo,
    clave: clave,
    edad: edad,
  });
  usuario.clave = await usuario.encryptClave(usuario.clave);
  await usuario.save();
  res.status(201).json({
    message: "Usuario registrado exitosamente",
    user: {
      nombre: usuario.nombre,
      correo: usuario.correo,
      edad: usuario.edad,
    },
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
  if (!validPassword) return res.status(400).json({ error: "Clave no válida" });
  const token = jwt.sign({ id: usuario._id }, process.env.SECRET, {
    expiresIn: 60 * 60 * 24, //un día en segundos
  });
  res.json({
    error: null,
    data: "Bienvenido(a)",
    auth: true,
    token,
    user: {
      id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      edad: usuario.edad,
    },
  });
});

//Update Usuario
router.put("/usuario/:id", verifyToken, (req, res) => {
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
//get usuario
router.get("/", verifyToken, (req, res) => {
  userSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
//Asociar una Emocion a un Usuario
router.put("/emocion/:id", async (req, res) => {
    const { id } = req.params;

    try {
        let idEmocion = null;

        
        const emocionConsulta = await emocionesSchema.findOne({ descripcion: req.body.descripcion });

        if (!emocionConsulta) {
           
            const { _id, ...emocionData } = req.body;

            const nuevaEmocion = new emocionesSchema(emocionData);
            const dataEmociones = await nuevaEmocion.save();
            idEmocion = dataEmociones._id;
        } else {
            idEmocion = emocionConsulta._id;
        }

        const resultado = await userSchema.updateOne(
            { _id: id },
            {
                $addToSet: { emociones: idEmocion }, 
            }
        );

        res.json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});


//Asociar una meta a un usuario
router.put("/meta/:id", async (req, res) => {
  const { id } = req.params;

  try {
    let idMeta = null;

    // Busca si ya existe una meta con el mismo título
    const metaConsulta = await metasSchema.findOne({ titulo: req.body.titulo });

    if (!metaConsulta) {
      // Elimina el _id del cuerpo de la solicitud para evitar conflictos
      const { _id, ...metaData } = req.body;

      // Crea una nueva meta
      const nuevaMeta = new metasSchema(metaData);
      const dataMetas = await nuevaMeta.save();
      idMeta = dataMetas._id;
    } else {
      idMeta = metaConsulta._id;
    }

    // Actualiza el usuario con el ID proporcionado
    const resultado = await userSchema.updateOne(
      { _id: id },
      {
        $addToSet: { metas: idMeta }, // Agrega el ID de la meta al array si no está ya presente
      }
    );

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;