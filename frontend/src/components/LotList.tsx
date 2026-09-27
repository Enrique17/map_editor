import type { Lot } from "../types";

interface Props {
  lots: Lot[];
  onUpdate: (id: string, patch: Partial<Pick<Lot, "name" | "price" | "status">>) => void;
  onDelete: (id: string) => void;
}

export default function LotList({ lots, onUpdate, onDelete }: Props) {
  if (lots.length === 0) {
    return <p className="empty">Draw a polygon on the map to add a lot.</p>;
  }

  return (
    <div className="lot-list">
      {lots.map((lot) => (
        <div className="lot-card" key={lot.id}>
          <input
            value={lot.name}
            placeholder="Lot name / address"
            onChange={(e) => onUpdate(lot.id, { name: e.target.value })}
          />
          <input
            type="number"
            value={lot.price ?? ""}
            placeholder="Price (USD)"
            onChange={(e) => onUpdate(lot.id, { price: Number(e.target.value) })}
          />
          <select value={lot.status} onChange={(e) => onUpdate(lot.id, { status: e.target.value as Lot["status"] })}>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
          <button onClick={() => onDelete(lot.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
