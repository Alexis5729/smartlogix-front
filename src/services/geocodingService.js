const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const CACHE_PREFIX = "smartlogix:geocode:";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function normalizeAddress(address) {
  return address.trim().toLowerCase().replace(/\s+/g, " ");
}

function readCache(cacheKey) {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  try {
    const rawValue = storage.getItem(`${CACHE_PREFIX}${cacheKey}`);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

function writeCache(cacheKey, value) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(`${CACHE_PREFIX}${cacheKey}`, JSON.stringify(value));
  } catch {
    // Si el almacenamiento falla, el geocoding sigue funcionando sin caché.
  }
}

export async function geocodeAddress(address) {
  const cleanAddress = address?.trim();

  if (!cleanAddress) {
    return null;
  }

  const searchQuery = cleanAddress.toLowerCase().includes("chile")
    ? cleanAddress
    : `${cleanAddress}, Chile`;
  const cacheKey = normalizeAddress(searchQuery);
  const cachedLocation = readCache(cacheKey);

  if (cachedLocation) {
    return cachedLocation;
  }

  const requestUrl = new URL(NOMINATIM_URL);
  requestUrl.searchParams.set("q", searchQuery);
  requestUrl.searchParams.set("format", "jsonv2");
  requestUrl.searchParams.set("limit", "1");
  requestUrl.searchParams.set("accept-language", "es");

  const response = await fetch(requestUrl.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo consultar el mapa");
  }

  const results = await response.json();

  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const location = {
    lat: Number(results[0].lat),
    lng: Number(results[0].lon),
    label: results[0].display_name,
  };

  writeCache(cacheKey, location);
  return location;
}
