import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RNFS from "react-native-fs";

import { VIDEO_EXTENSIONS } from "../constants/formats";
import { useSelectionContext } from "../contexts/SelectionContext";
import { VideoFiles } from "./RenderFiles";


let cachedPaths = null;
const ITEM_HEIGHT = 70;

const requestPermission = async () => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      console.warn("Media library permission not granted");
      return false;
    }
    return true;
  } catch (error) {
    console.error("requestPermission error", error);
    return false;
  }
};

const extractFolderFromUri = (uri) => {
  if (!uri || typeof uri !== "string") return "";
  const normalized = uri.replace(/^file:\/\//, "");
  const parts = normalized.split("/").filter(Boolean);
  if (parts.length <= 1) return "";
  return parts.slice(0, -1).join("/");
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    paddingBottom: 20,
    // flex: 1,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
  },
  countText: {
    fontWeight: "bold",
  },
  flatList: {
    width: "100%",
    maxHeight: 370,
    marginHorizontal: "auto",
  },
  placeholder: {
    marginTop: 40,
    alignItems: "center",
  },
});

export default function VideoFolders() {
  const [videoPaths, setVideoPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoCounts, setVideoCounts] = useState({});

  const {toggleSelect,enterSelectionMode,isSelecting,selected} = useSelectionContext();

  async function getVideoCountInFolder(directoryPath) {
    const items = await RNFS.readDir(directoryPath);
    const videoFiles = items.filter(item => {
      if (item.isDirectory()) return false;
      const extension = item.name.split('.').pop().toLowerCase();
      return VIDEO_EXTENSIONS.includes(extension)
    });
    
    return videoFiles.length;
  }

  const getVideoFolders = useCallback(async () => {
    // if (cachedPaths && cachedPaths.length > 0) {
    //   setVideoPaths(cachedPaths);
    //   return;
    // }

    setLoading(true);
    setError("");

    const hasPermission = await MediaLibrary.requestPermissionsAsync();
    
    if (hasPermission.status !=="granted") {
      setLoading(false);
      setError("Permission denied for media library access.");
      return;
    }

    try {
      const folderSet = new Set();

      const assets = await MediaLibrary.getAssetsAsync({
        mediaType: "video",
        first: 2000,
      });
        
      assets.assets.forEach((asset) => {
        const folderPath = extractFolderFromUri(asset.uri);
        if (folderPath) folderSet.add(folderPath);
      });

      const newPaths = Array.from(folderSet).sort((a, b) => a.localeCompare(b));
      // cachedPaths = newPaths;
      setVideoPaths(newPaths);

      const counts = {};
      for (const folderPath of newPaths) {
        counts[folderPath] = await getVideoCountInFolder(folderPath);
      }

      setVideoCounts(counts);
    } catch (e) {
      console.error("getVideoFolders error", e);
      setError("Failed to load video folders.");
    } finally {
      setLoading(false);
    }
  }, []);

  const renderItem = useCallback(({ item }) => {
    const pathSegments = item.split("/").filter(Boolean);
    const folderName = pathSegments[pathSegments.length - 1] || item;
    
    return (
      <VideoFiles
        isDirectory={true}
        fileType=""
        fileName={folderName}
        path={item}
        count={videoCounts[item]}
        toggleSelect={toggleSelect}
        enterSelectionMode={enterSelectionMode}
        isSelecting={isSelecting}
        selected={selected.has(folderName)}
      />
    );
  }, [videoCounts,enterSelectionMode,toggleSelect,isSelecting,selected]);

  useEffect(() => {
    getVideoFolders();
  }, [getVideoFolders]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.countText}>{videoPaths.length} folders</Text>
        <TouchableOpacity
          onPress={() => {
            const sorted = [...videoPaths].sort((a, b) => a.localeCompare(b));
            setVideoPaths(sorted);
          }}
        >
          <MaterialCommunityIcons name="sort" size={20} />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.placeholder}>
          <Text>{error}</Text>
        </View>
      ) : videoPaths.length === 0 ? (
        <View style={styles.placeholder}>
          <Text>No video folders found.</Text>
        </View>
      ) : (
        <FlatList
          data={videoPaths}
          keyExtractor={(item) => item}
          style={styles.flatList}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={renderItem}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          initialNumToRender={10}        // items rendered on first load
          maxToRenderPerBatch={10}       // items rendered per batch while scrolling
          windowSize={5}                 // render window = 5 * screen height (default is 21)
          updateCellsBatchingPeriod={50} 
        />
      )}
    </View>
  );
}
