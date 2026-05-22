import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RNFS from "react-native-fs";

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { AUDIO_EXTENSIONS, VIDEO_EXTENSIONS } from "../constants/formats";
import { useSelectionContext } from "../contexts/SelectionContext";
import ActionBar from "./ActionBar";
import { ContentFiles, MusicFiles, VideoFiles } from "./RenderFiles";

function prepareItem(item) {
  const path = item.path;
  const splitPath = path.split('.');
  const type = splitPath[splitPath.length - 1];
  const time = new Date(item.mtime).toLocaleDateString();
  const subdir = item.isDirectory() ? item.subdirectoryCount : '';
  return { path, type, time, subdir };
}

const keyExtractor = (item) => item.path;

async function requestStoragePermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'App needs access to your storage',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

const styles = style()
const ITEM_HEIGHT = 70;

export default function FileDirectories({ title, root }) {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(false)
  const navigation = useRouter()

  const navigateBack = () => {
    navigation.back()
  }

  const renderItem = useCallback(({ item }) => {
    const { path, type, time, subdir } = prepareItem(item);
    return (
      <ContentFiles
        uri={path}
        isDirectory={item.isDirectory()}
        fileType={type}
        fileName={item.name}
        root={root}
        time={time}
        subdir={subdir}
      />
    );
  }, [root]); // root is the only external dependency

  useEffect(() => {
    async function listDirectories() {
      setLoading(true)

      try {
        const permission = await requestStoragePermission()
        if (!permission) return
        
        const items = await RNFS.readDir(root)

        
        const result = await Promise.all(
          items.map(async item => {
            // files cannot have subdirectories
            if (!item.isDirectory()) {
              return {
                ...item,
                subdirectoryCount: 0,
              };
            }

            // read contents of this folder
            const children = await RNFS.readDir(item.path);

            // count only folders
            const subdirectoryCount = children.filter(child =>
              child.isDirectory() || !child.isDirectory()
            ).length;

            return {
              ...item,
              subdirectoryCount,
            };
          })
        );

        setContents(result)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

    listDirectories()
  }, [])
   
  if (contents.length < 1 && !loading) {
    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={navigateBack}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text>{root}</Text>
          </View>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center", gap: 12, marginTop: 100 }}>
          <Image
            source={require('../../assets/images/empty.png')}
            style={{ width: 350, height: 350 }}
          />
          <Text style={{ fontSize: 22, color: "#555" }}>This folder is empty</Text>
        </View>
      
      </>
    )
  }

  return (
    <>
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={navigateBack}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text>{root}</Text>
          </View>
        </View>
      {
        !loading ?
        <FlatList
          data={contents}
          style={styles.flatList}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          removeClippedSubviews={true}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          windowSize={7}
          // getItemLayout={(_, index) => ({
          //   length: 64,        // set to your actual ContentFiles row height
          //   offset: 64 * index,
          //   index,
          // })}
        /> :
          <ActivityIndicator color={"blue"} size={"large"}/>
      }
      </> 
    </>
  )
}

export function VideoDirectories({title, root}) {
  const [contents, setContents] = useState([])
  const [loading, setLoading]  = useState(false)
  const navigation = useRouter()

  const {toggleSelect,enterSelectionMode,isSelecting,selected} = useSelectionContext();

  const navigateBack = () => {
    navigation.back()
  }

  const renderItem =useCallback(({ item }) => {
    const path = item.path
    const splitPath = path.split(".")
    const type = splitPath[splitPath.length - 1]
    const time = new Date(item.mtime).toLocaleDateString();

    return (
      <VideoFiles
        uri={path}
        isDirectory={item.isDirectory()}
        fileType={type}
        fileName={item.name}
        root={root}
        count=""
        toggleSelect={toggleSelect}
        enterSelectionMode={enterSelectionMode}
        isSelecting={isSelecting}
        path={path}
        time={time}
        selected={selected.has(item.name)}
      />
    )
  }, [root, toggleSelect, enterSelectionMode, isSelecting, selected])
  
  

  useEffect(() => {
    async function listDirectories() {
      setLoading(true);
      try {
        const permission = await requestStoragePermission();
        if (!permission) return;
        
        const items = await RNFS.readDir(root);
        const videos = items.filter(el => {
          const extension = el.name.split('.').pop().toLowerCase();
          return VIDEO_EXTENSIONS.includes(extension);
        });

        console.log("Fetch videos")

        setContents(videos);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    listDirectories();
  }, [root]);


  return (
    <>
      {isSelecting ?
        <ActionBar />
        :
        <View style={styles.header}>
          <TouchableOpacity onPress={navigateBack}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text>{root}</Text>
          </View>
        </View>
      }
      {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={contents}
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
    </>
  )
}

export function MusicDirectories({title, root}) {
  const [contents, setContents] = useState([])
  const navigation = useRouter()

  const navigateBack = () => {
    navigation.back()
  }

  useEffect(() => {
    async function listDirectories() {
      try {
        const permission = await requestStoragePermission();
        if (!permission) return;
        
        const items = await RNFS.readDir(root);
        const audio = items.filter(el => {
          const extension = el.name.split('.').pop().toLowerCase();
          return AUDIO_EXTENSIONS.includes(extension);
        });

        console.log("music videos")

        setContents(audio);
      } catch (error) {
        console.log(error);
      }
    }

    listDirectories();
  }, []);

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateBack}>
          <Ionicons name="arrow-back" size={24}/>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{title}</Text>            
          <Text>{root}</Text>            
        </View>
      </View>
      <FlatList
        data={contents}
        style={styles.flatList}
        contentContainerStyle={{paddingBottom:20}}
        renderItem={({ item }) => {
          const path = item.path
          const splitPath = path.split(".")
          const type = splitPath[splitPath.length - 1]
          const time = new Date(item.mtime).toLocaleDateString();

          return <MusicFiles
            isDirectory={item.isDirectory()}
            fileType={type}
            fileName={item.name}
            root={root}
            count={""}
            time={time}
          />
        }}
      />
    </>
  )
}

function style() {
  return StyleSheet.create({
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
}