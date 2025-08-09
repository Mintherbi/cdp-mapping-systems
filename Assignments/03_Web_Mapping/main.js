const statusEl = document.getElementById("status");

const map = L.map("map");
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);
map.setView([20, 0], 2);

init();

async function init() {
  const url = "./ip_locations.geojson"; // same folder as this file
  try {
    statusEl.textContent = `Fetching ${url}…`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const geojson = await res.json();

    const layer = L.geoJSON(geojson, {
      pointToLayer: (feature, latlng) =>
        L.circleMarker(latlng, {
          radius: 5,
          color: "#222",
          weight: 1,
          fillColor: "#ff5533",
          fillOpacity: 0.9,
        }).bindPopup(makePopup(feature)),
      style: () => ({
        color: "#0a6cff",
        weight: 2,
        fillOpacity: 0.2,
      }),
      onEachFeature: (feature, lyr) => {
        lyr.on("mouseover", () => lyr.openPopup());
      },
    }).addTo(map);

    fitToLayer(layer);
    const count = countFeatures(geojson);
    statusEl.textContent = `Loaded ${count} feature(s)`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = `Failed to load GeoJSON: ${err?.message || err}`;
  }
}

function makePopup(feature) {
  const props = feature?.properties || {};
  const entries = Object.entries(props);
  if (entries.length === 0) return "No properties";
  const rows = entries
    .map(([k, v]) => {
      const val =
        typeof v === "object" ? JSON.stringify(v, null, 2) : String(v);
      return `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(val)}</td></tr>`;
    })
    .join("");
  return `<table class="popup"><tbody>${rows}</tbody></table>`;
}

function fitToLayer(layer) {
  try {
    const b = layer.getBounds();
    if (b.isValid()) map.fitBounds(b.pad(0.2));
  } catch {
    // ignore
  }
}

function countFeatures(geojson) {
  if (geojson.type === "FeatureCollection" && Array.isArray(geojson.features)) {
    return geojson.features.length;
  }
  if (geojson.type === "Feature") return 1;
  return 0;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}