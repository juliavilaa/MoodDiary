const parser = require("body-parser");
const express = require("express");
const app = express();
const port = 3000;
const authenticationRoutes = require("./routes/authentication");
const emocionesRoutes = require("./routes/emociones");
const metasRoutes = require("./routes/metas");
//const reportesRoutes = require("./routes/reportes");
const mongoose = require("mongoose");


require("dotenv").config();
app.use(parser.urlencoded({ extended: false })); 

//permite leer los datos que vienen en la petición
app.use(parser.json()); 

// transforma los datos a formato JSON //Gestión de las rutas usando el middleware
app.use("/api", authenticationRoutes);
app.use(express.json()); 

app.use("/api/emociones", emocionesRoutes);
app.use(express.json()); 

app.use("/api/metas", metasRoutes);
app.use(express.json()); 

/* app.use("/api/reportes", reportesRoutes);
app.use(express.json());  */


//Conexión a la base de datos
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conexión exitosa"))
  .catch((error) => console.log(error)); //Conexión al puerto
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});