// app/hidden.jsx
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getHiddenVideos } from "../components/store/hiddenVideos";
import PinGate from "../components/ui/PinGate";

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { VideoFiles } from "../components/ui/RenderFiles";

export default function HiddenScreen() {
  const [unlocked, setUnlocked] = useState(false);
  const [videos, setVideos] = useState([]);

  const navigation = useRouter();

  const navigateBack = () => {
    navigation.back();
  }

  useFocusEffect(
    useCallback(() => {
      const goBack = () => {
        navigation.back();
        return true;
      }
      // Lock again when user leaves the screen
      const backhandler = BackHandler.addEventListener("hardwareBackPress", goBack);

      return () => {
        setUnlocked(false);
        backhandler.remove()
      }
    }, [navigation])
  );

  useEffect(() => {
    const vids = getHiddenVideos();
    console.log("VIDEOS: ", vids)
    setVideos(vids);
  }, []);

  const renderItem = useCallback(({ item }) => {
    const path = item.hiddenUri
    const splitPath = path.split(".")
    const type = splitPath[splitPath.length - 1]
    const time = new Date(item.modificationTime).toLocaleDateString();

    return (
      <VideoFiles
        uri={path}
        isDirectory={false}
        fileType={type}
        fileName={item.filename}
        count=""
        toggleSelect={"toggleSelect"}
        enterSelectionMode={"enterSelectionMode"}
        isSelecting={"isSelecting"}
        path={path}
        time={time}
        selected={"selected.has(item.id)"}
        duration={item.duration}
        id={item.id}
      />
    )
  }, [])

  function onUnlocked() {
    setUnlocked(true);
    setVideos(getHiddenVideos());
  }

  if (!unlocked) return <PinGate onUnlocked={onUnlocked} />;

  return (
    <>
    <View style={styles.header}>
      <TouchableOpacity onPress={navigateBack}>
        <Ionicons name="arrow-back" size={24} />
      </TouchableOpacity>
      <View>
        <Text style={styles.title}>Private Folder</Text>
        <Text>/hidden</Text>
      </View>
      </View>
      {
        videos.length < 1 ? 
          <View>
            <Image
              source={require('../assets/images/empty.png')}
              style={{ width: 350, height: 350 }}
            />
            <Text style={{ fontSize: 22, color: "#555",textAlign:"center" }}>This folder is empty</Text>
          </View>
        :
          <FlatList
            data={videos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
      }
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    gap: 15,
    background: "red",
    padding: 10,
    marginTop:30,
    boxShadow:"1px 5px 5px rgba(0,0,0,0.05)"
  },
  title: {
    fontSize: 20,
    fontWeight:"500"
  },
  flatList: {
    marginBottom: 20,
    width: 330,
    height: "85%",
    marginHorizontal: "auto"
  }

})