# Project Overview

I created GeoJSON files for the movement routes and the places (restaurants and shops) I visited while living in New York over the past month. Soon after moving, I was able to collect and build this data myself. While moving around, there were times I urgently needed a restroom. I wanted to combine this personal dataset with New York City’s public restroom data to quickly find restrooms I can use when needed.

## Datasets

### `WhereIHaveBeenInNewYork.geojson`
- Description: Personal dataset of last month’s movement paths and visited locations
- Geometry: LineString (routes), Point (visited places)
- CRS: WGS84 (EPSG:4326)
- Key fields
  - `Name`: name
  - `Category`: type (e.g., Movement Path, Coffee, Meal, Bar, Grocery, Home, Workout, Bank, etc.)
  - `Frequancy`: visit/use frequency (integer; field name matches the file)
  - `Rate`: preference/rating (integer)

### `Public Restrooms_20250720.geojson`
- Description: Locations of public restrooms in New York City
- Geometry: Point
- CRS: WGS84 (EPSG:4326)
- Key fields: May vary by source. Typical fields include `Name`, `Address`, `Hours`, `Accessibility`. Check the file to confirm actual columns.

## How it’s used
- Compute nearest distance from each restroom to my movement lines
- Visualize by distance:
  - Categorical bins (e.g., 0–50 m, 50–100 m, 100–200 m, 200–500 m, 500+ m)
  - Continuous gradient (closer = darker red, farther = lighter)
- Filter or sort restrooms by distance to find options fast
