import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ColectivAR API",
      version: "1.0.0",
      description:
        "API proxy para consultar transporte público de Buenos Aires. Consume la API del Gobierno de la Ciudad y expone endpoints HTTP + WebSocket.",
    },
    servers: [
      { url: "http://localhost:8080", description: "Local development" },
    ],
    components: {
      schemas: {
        VehiclePosition: {
          type: "object",
          properties: {
            route_short_name: {
              type: "string",
              description: "Número de línea",
            },
            trip_headsign: {
              type: "string",
              description: "Destino",
            },
            vehicle_id: {
              type: "string",
              description: "ID del vehículo",
            },
          },
          example: {
            route_short_name: "15",
            trip_headsign: "A",
            vehicle_id: "001",
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", description: "Mensaje de error" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/index.ts"],
};

export default swaggerJsdoc(options);
