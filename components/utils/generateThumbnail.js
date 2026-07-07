import AsyncStorage from "@react-native-async-storage/async-storage";
import { Directory, Paths } from "expo-file-system";
import { createThumbnail } from "react-native-create-thumbnail";
import * as RNFS from "react-native-fs";

import { createVideoPlayer, VideoPlayer } from "expo-video";

const METADATA_TIMEOUT_MS = 5000;
const STORAGE_KEY = "thumbnail_cache";
const cache = new Map();
const pending = new Map();

// Call once on app startup, e.g in your root layout
function checkVideoMetadata(uri) {
  return new Promise((resolve) => {
    let settled = false;
    let player;

    try {
      player = createVideoPlayer(uri);
    } catch (e) {
      resolve({ valid: false, reason: `init error: ${e.message}` });
      return;
    }

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      sub.remove();
      player.release();
      resolve({ valid: false, reason: "metadata timeout" });
    }, 5000);

    const sub = player.addListener("statusChange", (status) => {
      if (settled) return;
      if (status.status === "readyToPlay") {
        settled = true;
        clearTimeout(timer);
        sub.remove();
        const meta = { valid: true, duration: player.duration };
        player.release();
        resolve(meta);
      } else if (status.status === "error") {
        settled = true;
        clearTimeout(timer);
        sub.remove();
        player.release();
        resolve({ valid: false, reason: status.error?.message ?? "unknown" });
      }
    });
  });
}

export async function loadThumbnailCache() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const entries = JSON.parse(raw); // [[key, thumbUri], ...]
    console.log("STORED THUMBNAILS: ", entries.length);
    // Verify each file still exists on disk before restoring
    // (OS may have cleared temp files since last session)
    await Promise.all(
      entries.map(async ([key, thumbUri]) => {
        try {
          const [thumbExists, videoExists] = await Promise.all([
            RNFS.exists(thumbUri),
            RNFS.exists(key),
          ]);

          if (!videoExists) {
            console.log("VIDEO DOES NOT EXI")
            // Video is gone — delete thumbnail from disk too
            if (thumbExists) await RNFS.unlink(thumbUri);
          } else if (thumbExists) {
            // Both exist, restore to cache
            cache.set(key, thumbUri);
          }
          // If video exists but thumbnail doesn't, do nothing —
          // generateThumbnail() will recreate it on next render
        } catch (e) {
          console.log(`Cache check failed for ${key}:`, e);
        }
      })
    );
    
    await persistCache()
  } catch (e) {
    console.log("Failed to load thumbnail cache:", e);
  }
}

async function persistCache() {
  try {
    const entries = Array.from(cache.entries());
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.log("Failed to persist thumbnail cache:", e);
  }
}

export async function generateThumbnail(path) {
  const key = path.startsWith("file://") ? path : `file://${path}`;
  const filePath = key.replace("file://", "");

  // Empty or truncated files
  if (cache.has(key)) return cache.get(key);
  if (pending.has(key)) return pending.get(key);
  
  // 👇 guard against moved/deleted/inaccessible files
  const exists = await RNFS.exists(filePath);
  if (!exists) {
    console.log("Video file not found, skipping thumbnail:", filePath);
    return null;
  }

  const meta = await checkVideoMetadata(key);
  if (!meta.valid) {
    // console.log("Corrupt/unreadable video, skipping thumbnail:", filePath, meta.reason);
    return null;
  }

  const uriToUse = key

  const promise = createThumbnail({
    url: uriToUse,
    format: "jpeg",
    timeStamp: 1000,
  })
    .then(async ({ path: thumbUri }) => {

      cache.set(key, thumbUri);
      pending.delete(key);
      await persistCache(); // 👈 write updated map to AsyncStorage
      return thumbUri;
    })
    .catch((e) => {
      console.log("Thumbnail error:", e);
      pending.delete(key);
      return null;
    });
  

  pending.set(key, promise);
  return promise;
}

export async function clearThumbnailCache() {
  cache.clear();
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function readThumbnailFiles() {
  const directory = new Directory(Paths.cache, "thumbnails");

  try {
    printDirectory(directory);
  } catch (error) {
    console.error(error);
  }
}

function printDirectory(directory, indent) {
  console.log(`${' '.repeat(indent)} + ${directory.name}`);

  const contents = directory.list();

  for (const item of contents) {
    if (item instanceof Directory) {
      printDirectory(item, indent + 2);
    } else {
      console.log(`${' '.repeat(indent + 2)} - ${item.name} (${item.size} bytes)`);
    }
  }
}