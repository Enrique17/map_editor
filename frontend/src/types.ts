export interface PolygonGeometry {
  type: "Polygon";
  coordinates: number[][][];
}

export type LotStatus = "available" | "reserved" | "sold";

export interface LotInput {
  name: string;
  price?: number;
  status: LotStatus;
  geometry: PolygonGeometry;
}

export interface Lot extends LotInput {
  id: string;
  createdAt: string;
}
