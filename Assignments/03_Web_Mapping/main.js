const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch('./data/har_requests.geojson')
  .then(r => r.json())
  .then(geojson => {
    const layer = L.geoJSON(geojson, {
      pointToLayer: (feature, latlng) =>
        L.circleMarker(latlng, {
          radius: 6,
          color: '#cc0000',
          fillColor: '#ff6666',
          fillOpacity: 0.8,
          weight: 1
        }),
      onEachFeature: (feature, layer) => {
        const p = feature.properties || {};
        const title = p.host || p.hostname || p.domain || p.url || 'Request';
        const details = Object.entries(p)
          .map(([k, v]) => `<div><b>${k}</b>: ${String(v)}</div>`)
          .join('');
        layer.bindPopup(`<div><h4 style="margin:0 0 4px 0">${title}</h4>${details}</div>`);
      }
    }).addTo(map);

    try {
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    } catch {}
  })
  .catch(() => {
    alert('GeoJSON 로드에 실패했습니다. 경로를 확인하세요: ./data/har_requests.geojson');
  });
