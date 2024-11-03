//const verifyToken = require('./validate_token');
const express = require("express");
const router = express.Router(); //manejador de rutas de express
const metasSchema = require("../models/metas"); //Nuevo animal

router.post("/", (req, res) => {
  const metas = metasSchema(req.body);
  metas
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
module.exports = router;
//Consultar todos las metas
router.get("/",(req, res) => {
  metaslSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
