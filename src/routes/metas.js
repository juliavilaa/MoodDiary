const verifyToken = require('./validate_token');
const express = require("express");
const router = express.Router(); //manejador de rutas de express
const metasSchema = require("../models/metas"); //Nuevo animal

router.post("/", verifyToken, (req, res) => {
  const metas = metasSchema(req.body);
  metas
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Consultar todos las metas
router.get("/",verifyToken,(req, res) => {
  metasSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Consultar meta por du id
router.get("/:id", verifyToken,(req, res) => {
    const { id } = req.params;
    metasSchema
      .findById(id)
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });
  
  //Modificar una emocion por su id
  router.put("/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, fechaInicio, fechaFinalizacion,estado } = req.body;
    metasSchema
      .updateOne(
        { _id: id },
        {
          $set: { titulo, descripcion, fechaInicio, fechaFinalizacion, estado },
        }
      )
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });
  
  //Eliminar una emocion por su id
  
  router.delete("/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    metasSchema
      .findByIdAndDelete(id)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json({ message: error });
      });
  });
module.exports = router;

