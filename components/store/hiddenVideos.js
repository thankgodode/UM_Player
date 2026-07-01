// store/hiddenVideos.js
import * as FileSystem from "expo-file-system/legacy";
import * as SecureStore from "expo-secure-store";
import * as RNFS from "react-native-fs";
import { Toast } from "toastify-react-native";


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
    Toast.show({
      type: 'success',
      text1: 'Successfully hidden file.',
      position: 'bottom',
      visibilityTime: 2000,
      autoHide: true,
      // onPress: () => console.log('Toast pressed'),
      // onShow: () => console.log('Toast shown'),
      // onHide: () => console.log('Toast hidden'),
    })
  } catch (e) {
    console.log("Failed to hide video:", e);
    Toast.show({
      type: 'error',
      text1: 'Error occured while trying to hide file',
      position: 'bottom',
      visibilityTime: 2000,
      autoHide: true,
      // onPress: () => console.log('Toast pressed'),
      // onShow: () => console.log('Toast shown'),
      // onHide: () => console.log('Toast hidden'),
    })
  }
}

export async function unhideVideo(videoId) {
  try {
    const video = hiddenVideos.find((v) => v.id === videoId);
    if (!video) return;

    // Move file back to original location
    await RNFS.moveFile(video.hiddenUri, video.originalUri);
    console.log(video.hiddenUri, video.originalUri)
    
    hiddenVideos = hiddenVideos.filter((v) => v.id !== videoId);
    await persist();
    Toast.show({
      type: 'success',
      text1: 'Successfully unhidden file.',
      position: 'bottom',
      visibilityTime: 2000,
      autoHide: true,
      // onPress: () => console.log('Toast pressed'),
      // onShow: () => console.log('Toast shown'),
      // onHide: () => console.log('Toast hidden'),
    })
  } catch (e) {
    console.log("Failed to unhide video:", e);
    Toast.show({
      type: 'error',
      text1: 'An error occured while trying to unhide file.',
      position: 'bottom',
      visibilityTime: 2000,
      autoHide: true,
      // onPress: () => console.log('Toast pressed'),
      // onShow: () => console.log('Toast shown'),
      // onHide: () => console.log('Toast hidden'),
    })
  }
}

export function getHiddenVideos() {
  return hiddenVideos;
}