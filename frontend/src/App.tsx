import { useEffect, useState } from "react";
import MapEditor from "./components/MapEditor";
import LotList from "./components/LotList";
import { api } from "./api";
import type { Lot, PolygonGeometry } from "./types";
import "./styles.css";

export default function App() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.list().then(setLots).catch((e) => setError(e.message));
  }, []);

  async function handleCreate(geometry: PolygonGeometry) {
    try {
      const lot = await api.create({ name: `Lot ${lots.length + 1}`, status: "available", geometry });
      setLots((prev) => [...prev, lot]);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleUpdate(id: string, patch: Partial<Pick<Lot, "name" | "price" | "status">>) {
    const current = lots.find((l) => l.id === id);
    if (!current) return;
    const next = { ...current, ...patch };
    setLots((prev) => prev.map((l) => (l.id === id ? next : l))); // optimistic
    try {
      await api.update(id, { name: next.name, price: next.price, status: next.status, geometry: next.geometry });
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleDelete(id: string) {
    setLots((prev) => prev.filter((l) => l.id !== id)); // optimistic
    try {
      await api.remove(id);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Lot Mapper</h1>
        <p>Draw property boundaries on the satellite map and manage listings.</p>
        {error && <p className="error">{error}</p>}
      </header>
      <main>
        <div className="map-pane">
          <MapEditor onCreate={handleCreate} />
        </div>
        <aside className="list-pane">
          <h2>Lots ({lots.length})</h2>
          <LotList lots={lots} onUpdate={handleUpdate} onDelete={handleDelete} />
        </aside>
      </main>
    </div>
  );
}
