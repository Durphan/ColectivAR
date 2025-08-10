import express from "express";
import cors from "cors";
import axios from "axios";
import { WebSocketServer } from "ws";
require("dotenv").config();
const bodyparser = require("body-parser");
const compression = require("compression");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(compression());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const base_url =
  "https://apitransporte.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?client_id=";
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const url = `${base_url}${client_id}&client_secret=${client_secret}`;
const wss = new WebSocketServer({ port: 8081 });

wss.on("connection", (ws) => {
  console.log("Conexion establecida");
  ws.on("close", () => console.log("Conexion cerrada"));
  ws.on("message", (message) => {
    console.log("Mensaje recibido");
    const data = JSON.parse(message);
    setInterval(async () => {
      const { agencia, ruta } = data;
      console.log("Agencia:", agencia);
      console.log("Ruta:", ruta);
      try {
        const response = await axios.get(url);
        const colectivos = response.data.filter(
          (colectivo) =>
            colectivo.route_short_name === agencia &&
            colectivo.trip_headsign === ruta
        );
        ws.send(JSON.stringify(colectivos));
        console.log("Datos enviados");
      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
      }
    }, 30000);
  });
});

app.get("/colectivos", async (req, res) => {
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/colectivos/numeros", async (req, res) => {
  try {
    const response = await axios.get(url);
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
    const response = await axios.get(url);
    const rutas = response.data.map((colectivo) => colectivo.trip_headsign);
    res.json(rutas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/colectivos/rutas/:numero", async (req, res) => {
  try {
    const response = await axios.get(url);
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
    const response = await axios.get(url);
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

app.post("/colectivos-seleccionados", async (req, res) => {
  try {
    const response = await axios.get(url);
    const colectivos = response.data.filter(
      (colectivo) =>
        colectivo.route_short_name === req.body.agencia &&
        colectivo.trip_headsign === req.body.ruta
    );
    res.json(colectivos).status(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8080, () => console.log("proxy escuchando en el puerto 8080"));
