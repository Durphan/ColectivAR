import logger from "../common/config/logger.js";

export function setupWebSocket(wss, service) {
  wss.on("connection", (ws) => {
    logger.info("Conexion establecida");

    let intervalId = null;

    ws.on("message", (message) => {
      const { agencia, ruta } = JSON.parse(message);

      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }

      intervalId = setInterval(async () => {
        try {
          const result = await service.getByNumeroAndRuta(agencia, ruta);
          ws.send(JSON.stringify(result));
        } catch (error) {
          logger.error("Error al obtener los datos:", error.message);
        }
      }, 30000);
    });

    ws.on("close", () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      logger.info("Conexion cerrada");
    });

    ws.on("error", (error) => {
      logger.error("Error al obtener los datos:", error.message);
    });
  });
}
