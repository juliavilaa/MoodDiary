const express = require("express");
const router = express.Router(); //manejador de rutas de express
const emocionesSchema = require("../models/Emociones");
const verifyToken = require('./validate_token');


// Postear emociones
router.post("/", verifyToken, (req, res) => {
  const emociones = emocionesSchema(req.body);
  emociones
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Consultar todas las emociones
router.get("/", verifyToken,  (req, res) => {
  emocionesSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Consultar emocion por du id
router.get("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  emocionesSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Modificar una emocion por su id
router.put("/:id",verifyToken, (req, res) => {
  const { id } = req.params;
  const { nombreEmocion, descripcion, fecha } = req.body;
  emocionesSchema
    .updateOne(
      { _id: id },
      {
        $set: { nombreEmocion, descripcion, fecha },
      }
    )
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Eliminar una emocion por su id

router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  emocionesSchema
    .findByIdAndDelete(id)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ message: error });
    });
});


module.exports = router;