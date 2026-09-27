import type { Lot, LotInput } from "./types";

const BASE = "/api/lots";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  list: () => fetch(BASE).then((r) => handle<Lot[]>(r)),
  create: (input: LotInput) =>
    fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    }).then((r) => handle<Lot>(r)),
  update: (id: string, input: LotInput) =>
    fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    }).then((r) => handle<Lot>(r)),
  remove: (id: string) => fetch(`${BASE}/${id}`, { method: "DELETE" }).then((r) => handle<void>(r))
};
