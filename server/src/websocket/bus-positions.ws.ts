import type { WebSocketServer, WebSocket } from "ws";
import logger from "../common/config/logger.js";
import { wsMessageSchema } from "../schemas/bus-positions.schema.js";
import type { IColectivoPollingService } from "../features/bus-positions/interfaces/colectivo-polling-service.js";
import { AppError } from "../errors/AppError.js";

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
            const errorCode = error instanceof AppError ? error.errorCode : "INTERNAL_ERROR";
            const message = error instanceof Error ? error.message : "Unknown error";
            try {
              ws.send(JSON.stringify({ type: "error", payload: { code: errorCode, message } }));
              logger.debug(`Sent WS error frame: ${errorCode}`);
            } catch (sendError) {
              logger.warn(`Failed to send WS error frame: ${(sendError as Error).message}`);
            }
          }
        }, 30000);
      } catch (error) {
        logger.warn("Invalid WS message, sending error frame");
        const message = error instanceof Error ? error.message : "Failed to parse message";
        try {
          ws.send(JSON.stringify({
            type: "error",
            payload: { code: "VALIDATION_ERROR", message },
          }));
        } catch (sendError) {
          logger.warn(`Failed to send WS error frame: ${(sendError as Error).message}`);
        }
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
