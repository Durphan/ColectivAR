import type { IColectivoRepository } from "./interfaces/colectivo-repository.js";
import type { IBusPositionsService } from "./interfaces/bus-positions-service.js";
import type { VehiclePosition } from "../../types/vehicle-position.js";

export class BusPositionsService implements IBusPositionsService {
  private repository: IColectivoRepository;

  constructor(repository: IColectivoRepository) {
    this.repository = repository;
  }

  async getAll(): Promise<VehiclePosition[]> {
    return this.repository.fetchAll();
  }

  async getByNumberAndRoute(
    numero: string,
    ruta: string,
  ): Promise<VehiclePosition[]> {
    return this.repository.getByNumberAndRoute(numero, ruta);
  }

  async getNumbers(): Promise<string[]> {
    return this.repository.getNumbers();
  }

  async getRoutes(): Promise<string[]> {
    return this.repository.getRoutes();
  }

  async getRoutesByNumber(numero: string): Promise<string[]> {
    return this.repository.getRoutesByNumber(numero);
  }
}
