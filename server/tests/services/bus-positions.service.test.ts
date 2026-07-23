import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IColectivoRepository } from "../../src/features/bus-positions/interfaces/colectivo-repository.js";
import { BusPositionsService } from "../../src/features/bus-positions/bus-positions.service.js";
import { VehiclePosition } from "../../src/types/vehicle-position.js";

describe("BusPositionsService", () => {
  const mockData: VehiclePosition[] = [
    { route_short_name: "15", trip_headsign: "A", vehicle_id: "001" },
    { route_short_name: "15", trip_headsign: "B", vehicle_id: "002" },
    { route_short_name: "29", trip_headsign: "C", vehicle_id: "003" },
    { route_short_name: "29", trip_headsign: "C", vehicle_id: "004" },
    { route_short_name: "111", trip_headsign: "A", vehicle_id: "005" },
  ];

  let mockRepo: IColectivoRepository;
  let service: BusPositionsService;

  beforeEach(() => {
    mockRepo = {
      fetchAll: vi.fn().mockResolvedValue(mockData),
      getNumbers: vi
        .fn()
        .mockResolvedValue(
          Array.from(new Set(mockData.map((item) => item.route_short_name))),
        ),
      getRoutes: vi
        .fn()
        .mockResolvedValue(
          Array.from(new Set(mockData.map((item) => item.trip_headsign))),
        ),
      getRoutesByNumber: vi
        .fn()
        .mockImplementation((numero: string) =>
          Promise.resolve(
            Array.from(
              new Set(
                mockData
                  .filter((item) => item.route_short_name === numero)
                  .map((item) => item.trip_headsign),
              ),
            ),
          ),
        ),
      getByNumberAndRoute: vi
        .fn()
        .mockImplementation((numero: string, ruta: string) =>
          Promise.resolve(
            mockData.filter(
              (item) =>
                item.route_short_name === numero && item.trip_headsign === ruta,
            ),
          ),
        ),
    };
    service = new BusPositionsService(mockRepo);
  });

  describe("getAll", () => {
    it("should return all vehicle positions", async () => {
      const result = await service.getAll();
      expect(result).toEqual(mockData);
      expect(mockRepo.fetchAll).toHaveBeenCalledOnce();
    });
  });

  describe("getNumbers", () => {
    it("should return all route_short_name values", async () => {
      const result = await service.getNumbers();
      expect(result).toEqual(["15", "29", "111"]);
    });

    it("should not preserve duplicates", async () => {
      const result = await service.getNumbers();
      expect(result).toHaveLength(3);
    });
  });

  describe("getRoutes", () => {
    it("should return all trip_headsign values", async () => {
      const result = await service.getRoutes();
      expect(result).toEqual(["A", "B", "C"]);
    });

    it("should not preserve duplicates", async () => {
      const result = await service.getRoutes();
      expect(result).toHaveLength(3);
    });
  });

  describe("getRoutesByNumber", () => {
    it("should filter trip_headsign by route number", async () => {
      const result = await service.getRoutesByNumber("15");
      expect(result).toEqual(["A", "B"]);
    });

    it("should return empty array for non-existent route", async () => {
      const result = await service.getRoutesByNumber("999");
      expect(result).toEqual([]);
    });

    it("should not return duplicates when multiple vehicles share same headsign", async () => {
      const result = await service.getRoutesByNumber("29");
      expect(result).toEqual(["C"]);
    });
  });

  describe("getByNumberAndRoute", () => {
    it("should filter by both route number and headsign", async () => {
      const result = await service.getByNumberAndRoute("15", "A");
      expect(result).toEqual([mockData[0]]);
    });

    it("should return multiple vehicles matching both criteria", async () => {
      const result = await service.getByNumberAndRoute("29", "C");
      expect(result).toEqual([mockData[2], mockData[3]]);
    });

    it("should return empty array for non-existent combination", async () => {
      const result = await service.getByNumberAndRoute("15", "Z");
      expect(result).toEqual([]);
    });

    it("should return empty array when BA API returns empty", async () => {
      (
        mockRepo.getByNumberAndRoute as ReturnType<typeof vi.fn>
      ).mockResolvedValue([]);
      const result = await service.getByNumberAndRoute("15", "A");
      expect(result).toEqual([]);
    });
  });

  describe("error handling", () => {
    it("should propagate repository errors", async () => {
      const error = new Error("API unreachable");
      (
        mockRepo.getByNumberAndRoute as ReturnType<typeof vi.fn>
      ).mockRejectedValue(error);
      await expect(service.getByNumberAndRoute("15", "A")).rejects.toThrow(
        "API unreachable",
      );
    });

    it("should not call repository more than once per method call", async () => {
      await service.getRoutesByNumber("15");
      expect(mockRepo.getRoutesByNumber).toHaveBeenCalledOnce();
    });
  });
});
