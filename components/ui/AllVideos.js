
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

        const splitPath = asset.uri.split(".");
        const fileType = splitPath[splitPath.length - 1];
        const formattedTime = new Date(asset.modificationTime).toLocaleDateString();
        const formattedDuration = new Date(asset.duration * 1000).toISOString().substring(11, 19);

        newAssets.push({
          ...asset,
          fileType,
          formattedTime,
          formattedDuration,
        });
        
          setAllVideos(newAssets); // 👈 a
        }


    } catch (e) {
      console.error("getVideoFolders error", e);
      setError("Failed to load video folders.");
    } finally {
      setLoading(false);
    }
  }, []);

  const renderItem = useCallback(({ item }) => (
    <VideoFiles
      uri={item.uri}
      isDirectory={false}
      fileType={item.fileType}
      fileName={item.filename}
      count=""
      toggleSelect={toggleSelect}
      enterSelectionMode={enterSelectionMode}
      isSelecting={isSelecting}
      path={item.uri}
      time={item.formattedTime}
      selected={selected.has(item.id)}
      duration={item.formattedDuration}
      id={item.id}
      sheetType={"video"}
      location={"all"}
    />
  ), [toggleSelect, enterSelectionMode, isSelecting, selected]);

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
          keyExtractor={(item) => item.id}
          style={styles.flatList}
          contentContainerStyle={{ paddingBottom: 5 }}
          renderItem={renderItem}
          // getItemLayout={(_, index) => ({
          //   length: 85,
          //   offset: 85 * index,
          //   index,
          // })}
          initialNumToRender={6}          // 👈 lower for faster first paint
          maxToRenderPerBatch={5}         // 👈 smaller batches, less blocking
          windowSize={5}                  // 👈 tighter render window
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}    // 👈 unmounts off-screen rows (big win on Android)
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
