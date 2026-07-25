import { z } from "zod";

export const numeroSchema = z.object({
  numero: z.coerce.string().min(1, "numero es requerido"),
});

export const agenciaRutaSchema = z.object({
  agencia: z.string().min(1, "agencia es requerida"),
  ruta: z.string().min(1, "ruta es requerida"),
});

export const wsMessageSchema = agenciaRutaSchema;

export type WSMessageParsed = z.infer<typeof wsMessageSchema>;
