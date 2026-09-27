import express from "express";
import cors from "cors";
import { LotInputSchema } from "./types.js";
import { listLots, createLot, updateLot, deleteLot } from "./store.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/lots", (_req, res) => {
  res.json(listLots());
});

app.post("/api/lots", (req, res) => {
  const parsed = LotInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  res.status(201).json(createLot(parsed.data));
});

app.put("/api/lots/:id", (req, res) => {
  const parsed = LotInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const updated = updateLot(req.params.id, parsed.data);
  if (!updated) return res.status(404).json({ error: "Lot not found" });
  res.json(updated);
});

app.delete("/api/lots/:id", (req, res) => {
  const ok = deleteLot(req.params.id);
  if (!ok) return res.status(404).json({ error: "Lot not found" });
  res.status(204).send();
});

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
