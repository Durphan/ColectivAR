import type { VehiclePosition } from "../../../types/vehicle-position.js";
import type { IColectivoPollingService } from "./colectivo-polling-service.js";

export interface IBusPositionsService extends IColectivoPollingService {
  getAll(): Promise<VehiclePosition[]>;
  getNumbers(): Promise<string[]>;
  getRoutes(): Promise<string[]>;
  getRoutesByNumber(numero: string): Promise<string[]>;
}
