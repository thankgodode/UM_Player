// app/hidden.jsx
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, FlatList, StyleSheet, Text, View } from "react-native";
import { getHiddenVideos } from "../components/store/hiddenVideos";
import PinGate from "../components/ui/PinGate";

import { Image } from "expo-image";
import SelectionProvider, { useSelectionContext } from "../components/contexts/SelectionContext";
import useVideoStore from "../components/store/videoStore";
import Navbar from "../components/ui/Navbar";
import { VideoFiles } from "../components/ui/RenderFiles";

export default function PrivateVideos() {
  return (
    <SelectionProvider>
      <HiddenScreen/>
    </SelectionProvider>
  )
}

function HiddenScreen() {
  const [unlocked, setUnlocked] = useState(false);
  const navigation = useRouter();
  const { selected, isSelecting, enterSelectionMode, toggleSelect, clearSelection } = useSelectionContext();

  const setPrivateVideos = useVideoStore((s) => s.setPrivateVideos);
  const privateVideos = useVideoStore((s) => s.privateVideos); // 👈 single source of truth

  // useFocusEffect(
  //   useCallback(() => {
  //     const goBack = () => {
  //       navigation.back();
  //       return true;
  //     };
  //     const backHandler = BackHandler.addEventListener("hardwareBackPress", goBack);
  //     return () => {
  //       setUnlocked(false);
  //       backHandler.remove();
  //     };
  //   }, [navigation])
  // );
  useFocusEffect(
    useCallback(() => {
      const goBack = () => {
        setUnlocked(false); // Lock only when back button is pressed
        navigation.back();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        goBack
      );

      return () => {
        backHandler.remove();
      };
    }, [navigation])
  );

  useEffect(() => {
    const vids = getHiddenVideos();
    setPrivateVideos(vids); // 👈 load into store on mount
  }, []);

  const renderItem = useCallback(({ item }) => {
    const path = item.hiddenUri;
    const splitPath = path.split(".");
    const type = splitPath[splitPath.length - 1];
    const time = new Date(item.modificationTime).toLocaleDateString();

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
        duration={item.duration}
        id={item.id}
      />
    );
  }, [toggleSelect, enterSelectionMode, isSelecting, selected]);

  function onUnlocked() {
    setUnlocked(true);
  }

  if (!unlocked) return <PinGate onUnlocked={onUnlocked} />;

  return (
    <>
      <Navbar title="Private Folder" unlock={true} />
      {privateVideos.length < 1 ? ( // 👈 use store, not local state
        <View>
          <Image
            source={require('../assets/images/empty.png')}
            style={{ width: 350, height: 350 }}
          />
          <Text style={{ fontSize: 22, color: "#555", textAlign: "center" }}>
            This folder is empty
          </Text>
        </View>
      ) : (
        <FlatList
          data={privateVideos} // 👈 same source for both empty check and list
          style={styles.container}
          keyExtractor={(item) => item.id ?? item.hiddenUri}
          renderItem={renderItem}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    gap: 15,
    // width:"100%",
    // background: "red",
    padding: 10,
    boxShadow:"1px 5px 5px rgba(0,0,0,0.05)"
  },
  title: {
    fontSize: 20,
    fontWeight:"500"
  },
  container: {
    marginBottom: 20,
    width: 330,
    height: "85%",
    marginHorizontal: "auto",
    paddingTop: 5,
    paddingRight: 5,
    paddingLeft: 5,
    paddingBottom: 5,
  }

})