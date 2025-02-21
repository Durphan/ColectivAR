import express from "express";
import cors from "cors";
import axios from "axios";
require("dotenv").config();
const bodyparser = require("body-parser");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

let numero;
let ruta;

app.get("/colectivos", async (req, res) => {
  try {
    const response = await axios.get(
      `https://apitransporte.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/colectivos/numeros", async (req, res) => {
  try {
    const response = await axios.get(
      `https://apitransporte.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`
    );
    const numeros = response.data.map(
      (colectivo) => colectivo.route_short_name
    );
    res.json(numeros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/colectivos/rutas", async (req, res) => {
  try {
    const response = await axios.get(
      `https://apitransporte.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`
    );
    const rutas = response.data.map((colectivo) => colectivo.trip_headsign);
    res.json(rutas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/colectivos/rutas/:numero", async (req, res) => {
  try {
    const response = await axios.get(
      `https://apitransporte.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`
    );
    const rutas = response.data
      .filter((colectivo) => colectivo.route_short_name === req.params.numero)
      .map((colectivo) => colectivo.trip_headsign);
    res.json(rutas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/colectivos/:numero/:ruta", async (req, res) => {
  try {
    const response = await axios.get(
      `https://apitransporte.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`
    );
    const colectivos = response.data.filter(
      (colectivo) =>
        colectivo.route_short_name === req.params.numero &&
        colectivo.trip_headsign === req.params.ruta
    );
    res.json(colectivos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/submit-form", async (req, res) => {
  ruta = req.body.ruta;
  numero = req.body.agencia;
  res.json({ message: "Formulario enviado" });
  console.log(ruta);
  console.log(numero);
});

app.get("/colectivos-seleccionados", async (req, res) => {
  try {
    const response = await axios.get(
      `https://apitransporte.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`
    );
    const colectivos = response.data.filter(
      (colectivo) =>
        colectivo.route_short_name === numero &&
        colectivo.trip_headsign === ruta
    );
    res.json(colectivos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8080, () => console.log("proxy escuchando en el puerto 8080"));
