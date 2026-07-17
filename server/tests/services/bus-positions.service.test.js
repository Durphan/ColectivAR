import { describe, it, expect, vi, beforeEach } from "vitest";
import { BusPositionsService } from "../../src/features/bus-positions/bus-positions.service.js";

describe("BusPositionsService", () => {
  const mockData = [
    { route_short_name: "15", trip_headsign: "A", vehicle_id: "001" },
    { route_short_name: "15", trip_headsign: "B", vehicle_id: "002" },
    { route_short_name: "29", trip_headsign: "C", vehicle_id: "003" },
    { route_short_name: "29", trip_headsign: "C", vehicle_id: "004" },
    { route_short_name: "111", trip_headsign: "A", vehicle_id: "005" },
  ];

  let mockRepo;
  let service;

  beforeEach(() => {
    mockRepo = {
      fetchAll: vi.fn().mockResolvedValue(mockData),
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

  describe("getNumeros", () => {
    it("should return all route_short_name values", async () => {
      const result = await service.getNumeros();
      expect(result).toEqual(["15", "15", "29", "29", "111"]);
    });

    it("should preserve duplicates", async () => {
      const result = await service.getNumeros();
      expect(result).toHaveLength(5);
    });
  });

  describe("getRutas", () => {
    it("should return all trip_headsign values", async () => {
      const result = await service.getRutas();
      expect(result).toEqual(["A", "B", "C", "C", "A"]);
    });

    it("should preserve duplicates", async () => {
      const result = await service.getRutas();
      expect(result).toHaveLength(5);
    });
  });

  describe("getRutasByNumero", () => {
    it("should filter trip_headsign by route number", async () => {
      const result = await service.getRutasByNumero("15");
      expect(result).toEqual(["A", "B"]);
    });

    it("should return empty array for non-existent route", async () => {
      const result = await service.getRutasByNumero("999");
      expect(result).toEqual([]);
    });

    it("should return duplicates when multiple vehicles share same headsign", async () => {
      const result = await service.getRutasByNumero("29");
      expect(result).toEqual(["C", "C"]);
    });
  });

  describe("getByNumeroAndRuta", () => {
    it("should filter by both route number and headsign", async () => {
      const result = await service.getByNumeroAndRuta("15", "A");
      expect(result).toEqual([mockData[0]]);
    });

    it("should return multiple vehicles matching both criteria", async () => {
      const result = await service.getByNumeroAndRuta("29", "C");
      expect(result).toEqual([mockData[2], mockData[3]]);
    });

    it("should return empty array for non-existent combination", async () => {
      const result = await service.getByNumeroAndRuta("15", "Z");
      expect(result).toEqual([]);
    });

    it("should return empty array when BA API returns empty", async () => {
      mockRepo.fetchAll.mockResolvedValue([]);
      const result = await service.getByNumeroAndRuta("15", "A");
      expect(result).toEqual([]);
    });
  });

  describe("error handling", () => {
    it("should propagate repository errors", async () => {
      const error = new Error("API unreachable");
      mockRepo.fetchAll.mockRejectedValue(error);
      await expect(service.getAll()).rejects.toThrow("API unreachable");
    });

    it("should not call repository more than once per method call", async () => {
      await service.getRutasByNumero("15");
      expect(mockRepo.fetchAll).toHaveBeenCalledOnce();
    });
  });
});
