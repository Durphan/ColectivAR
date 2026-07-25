import type { WebSocketServer, WebSocket } from "ws";
import logger from "../common/config/logger.js";
import { wsMessageSchema } from "../schemas/bus-positions.schema.js";
import type { IColectivoPollingService } from "../features/bus-positions/interfaces/colectivo-polling-service.js";

export function setupWebSocket(
  wss: WebSocketServer,
  service: IColectivoPollingService,
): void {
  wss.on("connection", (ws: WebSocket) => {
    logger.info("Conexion establecida");

    let intervalId: ReturnType<typeof setInterval> | null = null;

    ws.on("message", (message: WebSocket.Data) => {
      try {
        const parsed = JSON.parse(message.toString());
        const result = wsMessageSchema.safeParse(parsed);
        if (!result.success) {
          logger.error("Mensaje WebSocket inválido:", result.error.message);
          return;
        }

        const { agencia, ruta } = result.data;

        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }

        intervalId = setInterval(async () => {
          try {
            const data = await service.getByNumberAndRoute(agencia, ruta);
            ws.send(JSON.stringify(data));
          } catch (error) {
            logger.error("Error al obtener los datos:", (error as Error).message);
          }
        }, 30000);
      } catch (error) {
        logger.error("Error al parsear mensaje WebSocket:", (error as Error).message);
      }
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
