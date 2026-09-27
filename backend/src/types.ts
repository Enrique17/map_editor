import { z } from "zod";

// A GeoJSON polygon: array of rings, each ring an array of [lng, lat] pairs.
export const PolygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()])))
});

export const LotInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().nonnegative().optional(),
  status: z.enum(["available", "reserved", "sold"]).default("available"),
  geometry: PolygonSchema
});

export type LotInput = z.infer<typeof LotInputSchema>;

export interface Lot extends LotInput {
  id: string;
  createdAt: string;
}
