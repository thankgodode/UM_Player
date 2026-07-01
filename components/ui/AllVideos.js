
import * as MediaLibrary from "expo-media-library";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useVideoStore from "../store/videoStore";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as RNFS from "react-native-fs";
import { useSelectionContext } from "../contexts/SelectionContext";
import { VideoFiles } from "./RenderFiles";

// const ITEM_HEIGHT = 70;

export function AllVideos({refreshing, setRefreshing}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const allVideos = useVideoStore((s) => s.allVideos)
  const setAllVideos = useVideoStore((s) => s.setAllVideos)

  const {toggleSelect,enterSelectionMode,isSelecting,selected} = useSelectionContext();
  
  const getAllVideos = useCallback(async () => {
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

      
      const newAssets = []

      for (const asset of assets.assets) {
        const isExists = await RNFS.exists(asset.uri);

        if (!isExists) {
          continue; // skip missing files
        }

        newAssets.push(asset)
      }

      // Group assets by folder path
      setAllVideos(newAssets);

    } catch (e) {
      console.error("getVideoFolders error", e);
      setError("Failed to load video folders.");
    } finally {
      setLoading(false);
    }
  }, []);

  const renderItem =useCallback(({ item }) => {
    const path = item.uri
    const splitPath = path.split(".")
    const type = splitPath[splitPath.length - 1]
    const time = new Date(item.modificationTime).toLocaleDateString();
    const duration = new Date(item.duration * 1000).toISOString().substring(11, 19);

    return (
      <VideoFiles
        uri={path}
        isDirectory={false}
        fileType={type}
        fileName={item.filename}
        count=""
        toggleSelect={toggleSelect}
        enterSelectionMode={enterSelectionMode}
        isSelecting={isSelecting}
        path={path}
        time={time}
        selected={selected.has(item.id)}
        duration={duration}
        id={item.id}
        sheetType={"video"}
      />
    )
  }, [toggleSelect, enterSelectionMode, isSelecting, selected])
    
  // useFocusEffect(
  //   useCallback(() => {
  //     getAllVideos()
  //   }, [getAllVideos])
  // )

  useEffect(() => {
    getAllVideos()
  }, [getAllVideos])

  useEffect(() => {
    if (refreshing) {
      getAllVideos().finally(() => setRefreshing(false)); // 👈 fetch and signal done
    }
  }, [refreshing,getAllVideos,setRefreshing]);
    
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
        <Text style={styles.countText}>{allVideos.length} VIDEOS</Text>
        <TouchableOpacity
          onPress={() => console.log("Sort by name")}
        >
          <MaterialCommunityIcons name="sort" size={20} />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.placeholder}>
          <Text>{error}</Text>
        </View>
      ) : allVideos.length === 0 ? (
        <View style={styles.placeholder}>
          <Text>No video folders found.</Text>
        </View>
      ) : (
        // <FlatList
        //   data={allVideos}
        //   keyExtractor={(item) => item.path}
        //   style={styles.flatList}
        //   contentContainerStyle={{ paddingBottom: 20 }}
        //   renderItem={renderItem}
        //   getItemLayout={(_, index) => ({
        //     length: ITEM_HEIGHT,
        //     offset: ITEM_HEIGHT * index,
        //     index,
        //   })}
        //   initialNumToRender={10}        // items rendered on first load
        //   maxToRenderPerBatch={10}       // items rendered per batch while scrolling
        //   windowSize={5}                 // render window = 5 * screen height (default is 21)
        //   updateCellsBatchingPeriod={50} 
        // />
        <FlatList
          data={allVideos}
          style={styles.flatList}
          contentContainerStyle={{ paddingBottom: 5 }}
          // getItemLayout={(_, index) => ({
          //   length: 64,        // set to your actual ContentFiles row height
          //   offset: 64 * index,
          //   index,
          // })}
          initialNumToRender={8}        // items rendered on first load
          maxToRenderPerBatch={7}       // items rendered per batch while scrolling
          windowSize={7}                 // render window = 5 * screen height (default is 21)
          updateCellsBatchingPeriod={50}
          renderItem={renderItem}
        />
      )}
    </View>
  );    
}

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
