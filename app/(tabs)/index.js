import { useEffect } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { SheetProvider } from "react-native-actions-sheet";
import SelectionProvider from "../../components/contexts/SelectionContext";
import Navbar from "../../components/ui/Navbar";
import VideoScreen from "../../components/ui/RecentWatched";
import { Sheets } from "../../components/ui/sheets.tsx";
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
      <SelectionProvider>
        <Navbar
        title="Video"
      />
      
      
        {/* <ActionBar
        /> */}
        
      <SlideMenu />
      <ScrollView
        horizontal={true}
      >
        <VideoScreen />
        </ScrollView>
        <SheetProvider>
          <Sheets />
          <VideoFolders />
        </SheetProvider>
      </SelectionProvider>
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