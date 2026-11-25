import type { LatLng } from "./geo";

export type Place = LatLng & { id: string; name: string; group: "Campus" | "Airports" | "Transit" | "Shopping" | "Cities" };

/**
 * Preset pickup and destination points. Coordinates are approximate and only
 * used for matching distance, never shown as an exact address.
 */
export const PLACES: Place[] = [
  { id: "ucr-bell-tower", name: "UCR Bell Tower", group: "Campus", lat: 33.9737, lng: -117.3281 },
  { id: "lothian", name: "Lothian Residence Hall", group: "Campus", lat: 33.9775, lng: -117.322 },
  { id: "aberdeen-inverness", name: "Aberdeen-Inverness", group: "Campus", lat: 33.979, lng: -117.325 },
  { id: "pentland-hills", name: "Pentland Hills", group: "Campus", lat: 33.979, lng: -117.3195 },
  { id: "glen-mor", name: "Glen Mor", group: "Campus", lat: 33.969, lng: -117.3215 },
  { id: "bannockburn", name: "Bannockburn Village", group: "Campus", lat: 33.9806, lng: -117.332 },
  { id: "ont", name: "Ontario Airport (ONT)", group: "Airports", lat: 34.056, lng: -117.6 },
  { id: "lax", name: "Los Angeles Airport (LAX)", group: "Airports", lat: 33.9416, lng: -118.4085 },
  { id: "sna", name: "John Wayne Airport (SNA)", group: "Airports", lat: 33.6762, lng: -117.8675 },
  { id: "bur", name: "Burbank Airport (BUR)", group: "Airports", lat: 34.2006, lng: -118.3585 },
  { id: "psp", name: "Palm Springs Airport (PSP)", group: "Airports", lat: 33.8297, lng: -116.5067 },
  { id: "san", name: "San Diego Airport (SAN)", group: "Airports", lat: 32.7338, lng: -117.1933 },
  { id: "riverside-metrolink", name: "Riverside Downtown Metrolink", group: "Transit", lat: 33.9765, lng: -117.3696 },
  { id: "union-station", name: "LA Union Station", group: "Transit", lat: 34.0562, lng: -118.2365 },
  { id: "tyler-galleria", name: "Galleria at Tyler", group: "Shopping", lat: 33.9118, lng: -117.458 },
  { id: "canyon-crest", name: "Canyon Crest Town Center", group: "Shopping", lat: 33.958, lng: -117.3245 },
  { id: "irvine-spectrum", name: "Irvine Spectrum", group: "Shopping", lat: 33.651, lng: -117.7434 },
  { id: "dtla", name: "Downtown Los Angeles", group: "Cities", lat: 34.0407, lng: -118.2468 },
  { id: "westwood", name: "Westwood / UCLA", group: "Cities", lat: 34.0689, lng: -118.4452 },
  { id: "irvine", name: "Irvine / UCI", group: "Cities", lat: 33.6405, lng: -117.8443 },
  { id: "san-diego", name: "San Diego (downtown)", group: "Cities", lat: 32.7157, lng: -117.1611 },
];

export function findPlace(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}

export const PLACE_GROUPS = ["Campus", "Airports", "Transit", "Shopping", "Cities"] as const;
