import type { VehiclePosition } from "../../../types/vehicle-position.js";

export interface IBusPositionsController {
  getAll(): Promise<VehiclePosition[]>;
  getNumbers(): Promise<string[]>;
  getRoutes(): Promise<string[]>;
  getRoutesByNumber(numero: string): Promise<string[]>;
  getByNumberAndRoute(numero: string, ruta: string): Promise<VehiclePosition[]>;
}
