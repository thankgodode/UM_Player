import * as RNFS from "react-native-fs";

export async function deleteFile(filePath) {
    await RNFS.scanFile()
    // await FileSystem.deleteAsync(filePath);
}