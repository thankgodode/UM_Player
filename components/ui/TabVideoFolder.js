import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import * as RNFS from "react-native-fs";

import { useSelectionContext } from "../contexts/SelectionContext";
import useVideoActions from "../hooks/useVideoActions";
import useVideoStore from "../store/videoStore";
import { DeleteModal } from "./ActionModal";
import { VideoFiles } from "./RenderFiles";

const ITEM_HEIGHT = 70;

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
    // maxHeight: 370,
    marginHorizontal: "auto",
  },
  placeholder: {
    marginTop: 40,
    alignItems: "center",
  },
});

export default function VideoFolders({refreshing,setRefreshing}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setVideoFolders = useVideoStore((s) => s.setVideoFolders);
  const videoFolders = useVideoStore((s) => s.videoFolders);

  const { toggleSelect, enterSelectionMode, isSelecting, selected,clearSelection } = useSelectionContext();
  const {
      deleting,
      showDeleteModal,
      setShowDeleteModal,
      handleConfirmDelete,
  } = useVideoActions({
      onSuccess: (action) => console.log(`${action} completed`),
  });
 
  const getVideoFolders = useCallback(async () => {
    setLoading(true);
    setError("");

    const hasPermission = await MediaLibrary.requestPermissionsAsync();
    
    if (hasPermission.status !=="granted") {
      setLoading(false);
      setError("Permission denied for media library access.");
      return;
    }

    try {
      const assets = await MediaLibrary.getAssetsAsync({
        mediaType: "video",
        first: 10000,
      });

      // Group assets by folder path
      const folderMap = {};

      for (const asset of assets.assets) {
        const isExists = await RNFS.exists(asset.uri);

        if (!isExists) {
          continue; // skip missing files
        }

        const folderPath = extractFolderFromUri(asset.uri);

        if (!folderPath) continue;

        if (!folderMap[folderPath]) {
          folderMap[folderPath] = [];
        }
      
        
        folderMap[folderPath].push(asset);
      }

      // Transform into a sorted array of folder objects
      const folders = Object.entries(folderMap)
        .map(([path, videos]) => ({
          path,
          videos,
          count: videos.length,
        }))
        .sort((a, b) => a.path.localeCompare(b.path));

      setVideoFolders(folders);
    } catch (e) {
      console.error("getVideoFolders error", e);
      setError("Failed to load video folders.");
    } finally {
      setLoading(false);
    }
  }, []);

  const renderItem = useCallback(({ item }) => {
    const pathSegments = item.path.split("/").filter(Boolean);
    const folderName = pathSegments[pathSegments.length - 1];

    return (
      <VideoFiles
        isDirectory={true}
        fileType=""
        fileName={folderName}
        path={item.path}
        count={item.count}
        toggleSelect={toggleSelect}
        enterSelectionMode={enterSelectionMode}
        isSelecting={isSelecting}
        selected={selected.has(item.path)}
        id={item.path}
        sheetType={"folder"}
      />
    );
  }, [enterSelectionMode,toggleSelect,isSelecting,selected]);

  useEffect(() => {
    getVideoFolders();
  }, [getVideoFolders]);

  // useFocusEffect(
  //   useCallback(() => {
  //     getVideoFolders();
  //   }, [getVideoFolders])
  // );

  useEffect(() => {
    getVideoFolders();
  }, [getVideoFolders]) 

  useEffect(() => {
    if (refreshing) {
      getVideoFolders().finally(() => setRefreshing(false)); // 👈 fetch and signal done
    }
  }, [refreshing,getVideoFolders,setRefreshing]);

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
        <Text style={styles.countText}>{videoFolders.length} folders</Text>
        <TouchableOpacity
          onPress={() =>console.log("Sort by name")}
        >
          <MaterialCommunityIcons name="sort" size={20} />
        </TouchableOpacity>
      </View>
      <DeleteModal
        visible={showDeleteModal}
        count={selected.size}
        deleting={deleting}
        onConfirm={()=> handleConfirmDelete(selected,clearSelection)}
        onCancel={() => setShowDeleteModal(false)}
      />
      {error ? (
        <View style={styles.placeholder}>
          <Text>{error}</Text>
        </View>
      ) : videoFolders.length === 0 ? (
        <View style={styles.placeholder}>
          <Text>No video folders found.</Text>
        </View>
      ) : (
        <FlatList
          data={videoFolders}
          keyExtractor={(item) => item.path}
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
