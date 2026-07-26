import axios from "axios";
import type { IColectivoRepository } from "./interfaces/colectivo-repository.js";
import type { AppConfig } from "../../common/config/types/app-config.js";
import type { VehiclePosition } from "../../types/vehicle-position.js";
import type { ICache } from "../../common/config/interfaces/ICache.js";
import { ExternalApiError } from "../../errors/ExternalApiError.js";

export class ColectivoRepository implements IColectivoRepository {
  private _config: AppConfig;
  private _cache: ICache<VehiclePosition[]>;

  constructor(config: AppConfig, cache: ICache<VehiclePosition[]>) {
    this._config = config;
    this._cache = cache;
  }

  async fetchAll(): Promise<VehiclePosition[]> {
    try {
      const cachedData = this._cache.get("vehiclePositions");
      if (cachedData) {
        return cachedData;
      }
      const response = (
        await axios.get<VehiclePosition[]>(this._config.fullUrl, {
          timeout: 5000,
        })
      ).data;
      this._cache.set("vehiclePositions", response);
      return response;
    } catch (error) {
      throw new ExternalApiError(
        "Failed to fetch vehicle positions from external API",
      );
    }
  }

  async getNumbers(): Promise<string[]> {
    const data = await this.fetchAll();
    return Array.from(new Set(data.map((item) => item.route_short_name)));
  }

  async getRoutes(): Promise<string[]> {
    const data = await this.fetchAll();
    return Array.from(new Set(data.map((item) => item.trip_headsign)));
  }

  async getRoutesByNumber(numero: string): Promise<string[]> {
    const data = await this.fetchAll();
    return Array.from(
      new Set(
        data
          .filter((item) => item.route_short_name === numero)
          .map((item) => item.trip_headsign),
      ),
    );
  }

  async getByNumberAndRoute(
    numero: string,
    ruta: string,
  ): Promise<VehiclePosition[]> {
    return this.fetchAll().then((data) =>
      data.filter(
        (item) =>
          item.route_short_name === numero && item.trip_headsign === ruta,
      ),
    );
  }
}
