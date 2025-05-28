
// Cache utilities for optimizing requests
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export function getCacheKey(key: string, params?: any): string {
  return params ? `${key}_${JSON.stringify(params)}` : key;
}

export function setCache(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function getCache(key: string): any | null {
  const cached = cache.get(key);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}
