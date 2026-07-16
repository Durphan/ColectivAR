import { config } from "./common/config/env.js";
import { ColectivoRepository } from "./features/bus-positions/bus-positions.repository.js";
import { BusPositionsService } from "./features/bus-positions/bus-positions.service.js";
import { BusPositionsController } from "./features/bus-positions/bus-positions.controller.js";
import { createBusPositionsRouter } from "./routes/bus-positions.routes.js";
import { setupWebSocket } from "./websocket/bus-positions.ws.js";

const repository = new ColectivoRepository(config);
const service = new BusPositionsService(repository);
const controller = new BusPositionsController(service);
const router = createBusPositionsRouter(controller);

export { service, controller, router, setupWebSocket };
