import "dotenv/config";
import { WebSocketServer } from "ws";
import app from "../app.js";
import swaggerUi from "swagger-ui-express";
import { router, setupWebSocket, service } from "./injection.js";
import errorHandler from "./common/middleware/error-handler.js";

import logger from "./common/config/logger.js";
import swaggerSpec from "./common/config/swagger.js";
import { NotFoundError } from "./errors/NotFoundError.js";

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check del servicio
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Servicio funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", router);
app.use((_req, _res, next) => next(new NotFoundError("Route not found")));
app.use(errorHandler);

app.listen(8080, () => {
  logger.info("Server running on http://localhost:8080");
  logger.info("Swagger docs available at http://localhost:8080/api-docs");
});

const wss = new WebSocketServer({ port: 8081 });
setupWebSocket(wss, service);
logger.info("WebSocket server running on ws://localhost:8081");
