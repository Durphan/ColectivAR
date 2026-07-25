import type { IColectivoRepository } from "./interfaces/colectivo-repository.js";
import type { IBusPositionsService } from "./interfaces/bus-positions-service.js";
import type { VehiclePosition } from "../../types/vehicle-position.js";

export class BusPositionsService implements IBusPositionsService {
  private _repository: IColectivoRepository;

  constructor(repository: IColectivoRepository) {
    this._repository = repository;
  }

  async getAll(): Promise<VehiclePosition[]> {
    return this._repository.fetchAll();
  }

  async getByNumberAndRoute(
    numero: string,
    ruta: string,
  ): Promise<VehiclePosition[]> {
    return this._repository.getByNumberAndRoute(numero, ruta);
  }

  async getNumbers(): Promise<string[]> {
    return this._repository.getNumbers();
  }

  async getRoutes(): Promise<string[]> {
    return this._repository.getRoutes();
  }

  async getRoutesByNumber(numero: string): Promise<string[]> {
    return this._repository.getRoutesByNumber(numero);
  }
}
