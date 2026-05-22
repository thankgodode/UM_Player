import { createThumbnail } from "react-native-create-thumbnail";

// thumbnailCache.js — module-level cache, persists for app lifetime
const cache = new Map();
const pending = new Map(); // prevent duplicate concurrent requests for same uri

export async function generateThumbnail(path) {
  const key = path;

  // 1. Return cached result immediately
  if (cache.has(key)) return cache.get(key);

  // 2. If already in flight, wait for the same promise instead of starting a new one
  if (pending.has(key)) return pending.get(key);

  const uriToUse = `file://${path}`;

  const promise = createThumbnail({
    url: uriToUse,
    format: 'jpeg',
    timeStamp: 1000,
  })
    .then(({ path: thumbUri }) => {
      cache.set(key, thumbUri);
      pending.delete(key);
      return thumbUri;
    })
    .catch(e => {
      console.log('Thumbnail error:', e);
      pending.delete(key);
      return null;
    });

  pending.set(key, promise);
  return promise;
}

export function clearThumbnailCache() {
  cache.clear();
}