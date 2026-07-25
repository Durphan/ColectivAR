import type { VehiclePosition } from "../../types/vehicle-position.js";
import type { IBusPositionsService } from "./interfaces/bus-positions-service.js";
import type { IBusPositionsController } from "./interfaces/bus-positions-controller.js";

export class BusPositionsController implements IBusPositionsController {
  private _service: IBusPositionsService;

  constructor(service: IBusPositionsService) {
    this._service = service;
  }

  async getAll(): Promise<VehiclePosition[]> {
    return this._service.getAll();
  }

  async getNumbers(): Promise<string[]> {
    return this._service.getNumbers();
  }

  async getRoutes(): Promise<string[]> {
    return this._service.getRoutes();
  }

  async getRoutesByNumber(numero: string): Promise<string[]> {
    return this._service.getRoutesByNumber(numero);
  }

  async getByNumberAndRoute(
    numero: string,
    ruta: string,
  ): Promise<VehiclePosition[]> {
    return this._service.getByNumberAndRoute(numero, ruta);
  }
}
