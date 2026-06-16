import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, FlatList, ScrollView, StyleSheet } from "react-native";
import { SheetProvider } from "react-native-actions-sheet";
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


export default function Home() {
  const [recents, setRecents] = useState([])
  const [toggleMenu, setToggleMenu] = useState("all_videos")

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


  return (
    <SelectionProvider>
      <FlatList
        style={styles.container}
        data={[]} // empty data since content is in header
        keyExtractor={() => 'key'}
        renderItem={null}
        ListHeaderComponent={
          <>
            <Navbar title="Video" />
            <SlideMenu toggleMenu={toggleMenu} setToggleMenu={setToggleMenu} />
            <ScrollView horizontal={true}>
              <VideoScreen recents={recents} />
            </ScrollView>
            <SheetProvider>
              <Sheets />
              {toggleMenu === "all_folders" && <VideoFolders />}
              {toggleMenu === "all_videos" && <AllVideos/>}
            </SheetProvider>
          </>
        }
      />
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