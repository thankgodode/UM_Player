import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SheetProvider } from "react-native-actions-sheet";
import ToastManager from "toastify-react-native";
import SelectionProvider from "../../components/contexts/SelectionContext";
import { loadHiddenVideos } from "../../components/store/hiddenVideos.js";
import { AllVideos } from "../../components/ui/AllVideos.js";
import Navbar from "../../components/ui/Navbar";
import VideoScreen from "../../components/ui/RecentWatched";
import { Sheets } from "../../components/ui/sheets.tsx";
import SlideMenu from "../../components/ui/SlideMenu";
import VideoFolders from "../../components/ui/TabVideoFolder";
import { loadThumbnailCache } from "../../components/utils/generateThumbnail.js";
import { getRecentVideos, loadRecentVideos } from "../../components/utils/recentVideo.js";

const toastConfig = {
  success: (props) => (
    <View style={{ flex:1, width:"100%", backgroundColor: 'rgb(97, 149, 177)', padding: 16, borderRadius: 10 }}>
      <Text style={{ color: 'white', fontWeight: 400 }}>{props.text1}</Text>
    </View>
  ),
  // Override other toast types as needed
}

export default function Home() {
  const [recents, setRecents] = useState([])
  const [toggleMenu, setToggleMenu] = useState("all_videos")
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    async function load() {
      await loadThumbnailCache()
      await loadRecentVideos()
      await loadHiddenVideos()
      setRecents(getRecentVideos());
    }

    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const handler = BackHandler.addEventListener("hardwareBackPress", backAction);
    load()
    
    return () => handler.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setRecents(getRecentVideos());
    }, [])
  );

  const onRefresh = useCallback(async () => {
    console.log("REFRESHING")
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 3000);
  }, []);

  return (
    <SelectionProvider>
      <FlatList
        style={styles.container}
        data={[]} // empty data since content is in header
        keyExtractor={() => 'key'}
        renderItem={null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListHeaderComponent={
          <>
            <Navbar title="Video" />
            <SlideMenu toggleMenu={toggleMenu} setToggleMenu={setToggleMenu} />
            <ScrollView horizontal={true}>
              <VideoScreen recents={recents} />
            </ScrollView>
            <SheetProvider>
              <Sheets />
              {toggleMenu === "all_folders" && <VideoFolders refreshing={refreshing} setRefreshing={setRefreshing} />}
              {toggleMenu === "all_videos" && <AllVideos refreshing={refreshing} setRefreshing={setRefreshing} />}
            </SheetProvider>
          </>
        }
      />
      <ToastManager config={toastConfig} />
    </SelectionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: 5,
    paddingRight: 5,
    paddingLeft: 5,
    paddingBottom: 5,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 15,
  },
});