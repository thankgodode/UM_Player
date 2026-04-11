import { useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { useSelectionContext } from "../../components/contexts/SelectionContext";
import ActionBar from "../../components/ui/ActionBar";
import Navbar from "../../components/ui/Navbar";
import VideoScreen from "../../components/ui/RecentWatched";
import SlideMenu from "../../components/ui/SlideMenu";
import VideoFolders from "../../components/ui/TabVideoFolder";

export default function Home() {
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const handler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => handler.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // This runs every time the screen is focused
      clearSelection();
      
      // Optionally return a cleanup function
      return () => {
        // This runs when leaving the screen
      };
    }, [clearSelection])
  );

  const {isSelecting, clearSelection} = useSelectionContext();

  return (
    <View style={styles.container}>
      {!isSelecting && <Navbar title="Video" />}
      {isSelecting && <ActionBar/>}  
      <SlideMenu />
      <ScrollView
        horizontal={true}
      >
        <VideoScreen />
      </ScrollView>
      <VideoFolders />
    </View>
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