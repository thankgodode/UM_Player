// store/hiddenVideos.js
import * as FileSystem from "expo-file-system/legacy";
import * as SecureStore from "expo-secure-store";
import * as RNFS from "react-native-fs";


const STORAGE_KEY = "hidden_videos";
const HIDDEN_DIR = `${FileSystem.documentDirectory}hidden/`;

let hiddenVideos = []; // { id, originalUri, hiddenUri, filename, duration }

export async function loadHiddenVideos() {
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    if (!raw) return;
    hiddenVideos = JSON.parse(raw);
  } catch (e) {
    console.log("Failed to load hidden videos:", e);
  }
}

async function persist() {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(hiddenVideos));
}

export async function hideVideo(video) {
  try {
    const hiddenUri = `${HIDDEN_DIR}${video.filename}`;
    const folderExist = await FileSystem.getInfoAsync(HIDDEN_DIR);

    if (!folderExist.exists) {
      await FileSystem.makeDirectoryAsync(HIDDEN_DIR, { intermediates: true });
    }

    // Move file to private hidden directory
    await RNFS.moveFile(video.uri, hiddenUri);

    console.log("File moved to hidden directory!");

    hiddenVideos.unshift({
      id: video.id,
      originalUri: video.uri,
      hiddenUri,
      filename: video.filename,
      duration: video.duration,
    });

    await persist();
  } catch (e) {
    console.log("Failed to hide video:", e);
  }
}

export async function unhideVideo(videoId) {
  try {
    const video = hiddenVideos.find((v) => v.id === videoId);
    if (!video) return;

    // Move file back to original location
    await FileSystem.moveAsync({
      from: video.hiddenUri,
      to: video.originalUri,
    });

    hiddenVideos = hiddenVideos.filter((v) => v.id !== videoId);
    await persist();
  } catch (e) {
    console.log("Failed to unhide video:", e);
  }
}

export function getHiddenVideos() {
  return hiddenVideos;
}