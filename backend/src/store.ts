import { randomUUID } from "node:crypto";
import type { Lot, LotInput } from "./types.js";

// Simple in-memory store so the app runs with zero setup.
// Swap this file for a Postgres/PostGIS or MongoDB-backed implementation
// when you're ready to persist real data.
const lots = new Map<string, Lot>();

export function listLots(): Lot[] {
  return [...lots.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function createLot(input: LotInput): Lot {
  const lot: Lot = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
  lots.set(lot.id, lot);
  return lot;
}

export function updateLot(id: string, input: LotInput): Lot | undefined {
  if (!lots.has(id)) return undefined;
  const existing = lots.get(id)!;
  const updated: Lot = { ...existing, ...input };
  lots.set(id, updated);
  return updated;
}

export function deleteLot(id: string): boolean {
  return lots.delete(id);
}
