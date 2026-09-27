import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-draw";
import type { PolygonGeometry } from "../types";

interface Props {
  onCreate: (geometry: PolygonGeometry) => void;
  center?: [number, number];
  zoom?: number;
}

// Wraps Leaflet + Leaflet.draw imperatively. React only owns the container div;
// Leaflet manages everything inside it.
export default function MapEditor({ onCreate, center = [-17.393, -66.201], zoom = 18 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView(center, zoom);
    mapRef.current = map;

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles &copy; Esri", maxZoom: 18 }
    ).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: { allowIntersection: false, shapeOptions: { color: "#f4c430", weight: 3 } },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
      },
      edit: { featureGroup: drawnItems }
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer as L.Polygon;
      drawnItems.addLayer(layer);
      const geometry = layer.toGeoJSON().geometry as PolygonGeometry;
      onCreate(geometry);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}
