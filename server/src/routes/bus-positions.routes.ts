import { Router } from "express";
import { validateRequiredParams } from "../common/middleware/validate-params.js";
import type { IBusPositionsController } from "../features/bus-positions/interfaces/bus-positions-controller.js";
import { wrap } from "../types/express-helpers.js";

export function createBusPositionsRouter(controller: IBusPositionsController) {
  const router = Router();

  /**
   * @openapi
   * /colectivos:
   *   get:
   *     summary: Retorna todas las posiciones de colectivos
   *     tags: [Colectivos]
   *     responses:
   *       200:
   *         description: Array de posiciones de colectivos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/VehiclePosition'
   *       500:
   *         description: Error del servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get(
    "/colectivos",
    wrap(() => controller.getAll()),
  );

  /**
   * @openapi
   * /colectivos/numeros:
   *   get:
   *     summary: Retorna todos los números de línea
   *     tags: [Colectivos]
   *     responses:
   *       200:
   *         description: Array de números de línea
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: string
   */
  router.get(
    "/colectivos/numeros",
    wrap(() => controller.getNumbers()),
  );

  /**
   * @openapi
   * /colectivos/rutas:
   *   get:
   *     summary: Retorna todos los destinos (trip_headsign)
   *     tags: [Colectivos]
   *     responses:
   *       200:
   *         description: Array de destinos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: string
   */
  router.get(
    "/colectivos/rutas",
    wrap(() => controller.getRoutes()),
  );

  /**
   * @openapi
   * /colectivos/rutas/{numero}:
   *   get:
   *     summary: Retorna destinos filtrados por número de línea
   *     tags: [Colectivos]
   *     parameters:
   *       - in: path
   *         name: numero
   *         required: true
   *         schema:
   *           type: string
   *         description: "Número de línea (ej: 15)"
   *     responses:
   *       200:
   *         description: Array de destinos filtrados
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: string
   *       400:
   *         description: Parámetro faltante
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get(
    "/colectivos/rutas/:numero",
    validateRequiredParams(["numero"]),
    wrap((req) => controller.getRoutesByNumber(req.params.numero as string)),
  );

  /**
   * @openapi
   * /colectivos-seleccionados:
   *   post:
   *     summary: Retorna colectivos filtrados por línea y destino (body)
   *     tags: [Colectivos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               agencia:
   *                 type: string
   *                 description: "Número de línea (ej: 15)"
   *               ruta:
   *                 type: string
   *                 description: "Destino (ej: A)"
   *             required:
   *               - agencia
   *               - ruta
   *     responses:
   *       200:
   *         description: Array de colectivos filtrados
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/VehiclePosition'
   *       400:
   *         description: Parámetros faltantes
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post(
    "/colectivos-seleccionados",
    validateRequiredParams(["agencia", "ruta"]),
    wrap((req) =>
      controller.getByNumberAndRoute(req.body.agencia, req.body.ruta),
    ),
  );

  return router;
}
