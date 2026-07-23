import type { VehiclePosition } from "../../types/vehicle-position.js";
import type { IBusPositionsService } from "./interfaces/bus-positions-service.js";
import type { IBusPositionsController } from "./interfaces/bus-positions-controller.js";

export class BusPositionsController implements IBusPositionsController {
  private service: IBusPositionsService;

  constructor(service: IBusPositionsService) {
    this.service = service;
  }

  async getAll(): Promise<VehiclePosition[]> {
    return this.service.getAll();
  }

  async getNumbers(): Promise<string[]> {
    return this.service.getNumbers();
  }

  async getRoutes(): Promise<string[]> {
    return this.service.getRoutes();
  }

  async getRoutesByNumber(numero: string): Promise<string[]> {
    return this.service.getRoutesByNumber(numero);
  }

  async getByNumberAndRoute(
    numero: string,
    ruta: string,
  ): Promise<VehiclePosition[]> {
    return this.service.getByNumberAndRoute(numero, ruta);
  }
}
