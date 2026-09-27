# Lot Mapper

Small full-stack app for drawing property/lot boundaries on a satellite map
and managing them as listings. React + TypeScript frontend, Node + Express +
TypeScript backend.

## Structure

```
lot-mapper-app/
  backend/    Express API, in-memory store, GeoJSON validated with zod
  frontend/   Vite + React app, Leaflet + Leaflet.draw for the map
```

## Run it

In two terminals:

```bash
cd backend
npm install
npm run dev        # http://localhost:4000

cd frontend
npm install
npm run dev         # http://localhost:5173
```

The frontend proxies `/api/*` to the backend (see `vite.config.ts`), so just
open http://localhost:5173.

## How it works

- Draw a polygon on the map (top-left toolbar) → it's saved as a new lot via
  `POST /api/lots`, with the shape stored as GeoJSON.
- Edit the name, price, or status inline; changes save via
  `PUT /api/lots/:id`.
- Delete a lot to remove both the list entry and (on reload) its shape.

## Swapping in a real database

`backend/src/store.ts` is intentionally a stand-in — an in-memory `Map` — so
the app runs with zero setup. Replace it with:

- **Postgres + PostGIS**: store `geometry` as a `geometry(Polygon, 4326)`
  column; lets you run spatial queries like "lots within this boundary".
- **MongoDB**: store `geometry` as-is (it's already GeoJSON) and add a
  `2dsphere` index on that field.

The route handlers in `src/index.ts` don't need to change — only
`store.ts`'s implementation.

## Swapping the map provider

Esri's free satellite tiles are used here so nothing needs an API key. For
Google's imagery (closer to what you'd see in Google Maps), swap the
`L.tileLayer` call in `MapEditor.tsx` for the Google Maps JavaScript API and
its Drawing Library — same GeoJSON output, different tile source.
