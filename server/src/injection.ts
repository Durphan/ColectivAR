import { config } from "./common/config/env.js";
import type { IBusPositionsService } from "./features/bus-positions/interfaces/bus-positions-service.js";
import { ColectivoRepository } from "./features/bus-positions/bus-positions.repository.js";
import { BusPositionsService } from "./features/bus-positions/bus-positions.service.js";
import { BusPositionsController } from "./features/bus-positions/bus-positions.controller.js";
import { createBusPositionsRouter } from "./routes/bus-positions.routes.js";
import { setupWebSocket } from "./websocket/bus-positions.ws.js";
import { Cache } from "./common/config/cache.js";
import type { VehiclePosition } from "./types/vehicle-position.js";

const cache = new Cache<VehiclePosition[]>(30);
const repository = new ColectivoRepository(config, cache);
const service: IBusPositionsService = new BusPositionsService(repository);
const controller = new BusPositionsController(service);
const router = createBusPositionsRouter(controller);

export { service, controller, router, setupWebSocket };
