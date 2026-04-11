import { useEffect } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
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

  return (
    <View style={styles.container}>
      <Navbar title="Video" />
      <ActionBar />
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