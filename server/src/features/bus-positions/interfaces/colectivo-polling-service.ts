import type { VehiclePosition } from "../../../types/vehicle-position.js";

export interface IColectivoPollingService {
  getByNumberAndRoute(numero: string, ruta: string): Promise<VehiclePosition[]>;
}
