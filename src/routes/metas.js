const verifyToken = require('./validate_token');
const express = require("express");
const router = express.Router(); //manejador de rutas de express
const metasSchema = require("../models/metas"); 

router.post("/", verifyToken, (req, res) => {
  const metas = metasSchema(req.body);
  metas
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Consultar todos las metas
router.get("/", verifyToken, async (req, res) => {
  try {
      const metas = await metasSchema.find();
      const now = new Date();

      // Actualizar estados si las fechas ya pasaron
      const metasActualizadas = await Promise.all(
          metas.map(async (meta) => {
              if (meta.fechaFinalizacion && new Date(meta.fechaFinalizacion) < now && !meta.estado) {
                  meta.estado = true;
                  await meta.save();
              }
              return meta;
          })
      );

      res.json(metasActualizadas);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
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

