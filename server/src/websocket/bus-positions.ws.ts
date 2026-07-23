import type { WebSocketServer, WebSocket } from "ws";
import logger from "../common/config/logger.js";
import type { WSMessage } from "./ws-message.js";
import type { IColectivoPollingService } from "../features/bus-positions/interfaces/colectivo-polling-service.js";

export function setupWebSocket(
  wss: WebSocketServer,
  service: IColectivoPollingService,
): void {
  wss.on("connection", (ws: WebSocket) => {
    logger.info("Conexion establecida");

    let intervalId: ReturnType<typeof setInterval> | null = null;

    ws.on("message", (message: WebSocket.Data) => {
      const { agencia, ruta } = JSON.parse(message.toString()) as WSMessage;

      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }

      intervalId = setInterval(async () => {
        try {
          const result = await service.getByNumberAndRoute(agencia, ruta);
          ws.send(JSON.stringify(result));
        } catch (error) {
          logger.error("Error al obtener los datos:", (error as Error).message);
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

    ws.on("error", (error: Error) => {
      logger.error("Error al obtener los datos:", error.message);
    });
  });
}
