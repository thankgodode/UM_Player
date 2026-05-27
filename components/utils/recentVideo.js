// store/recentVideosStore.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "recent_videos";
const MAX_RECENT = 8; // cap to avoid bloat

let recentVideos = []; // in-memory list

// Call once in root layout
export async function loadRecentVideos() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    recentVideos = JSON.parse(raw);
  } catch (e) {
    console.log("Failed to load recent videos:", e);
  }
}

export async function addRecentVideo(video) {
  try {
    // Remove if already exists to avoid duplicates
    recentVideos = recentVideos.filter((v) => v.uri !== video.uri);

    // Add to the front
    recentVideos.unshift({
    //   id: video.id,
      uri: video.uri,
      filename: video.filename,
      duration: video.duration,
      currentTime: video.currentTime,
      playedAt: Date.now(),
    });

    // Trim to max
    if (recentVideos.length > MAX_RECENT) {
      recentVideos = recentVideos.slice(0, MAX_RECENT);
    }
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recentVideos));
  } catch (e) {
    console.log("Failed to save recent video:", e);
  }
}

export function getRecentVideos() {
  return recentVideos;
}

export async function clearRecentVideos() {
  recentVideos = [];
  await AsyncStorage.removeItem(STORAGE_KEY);
}