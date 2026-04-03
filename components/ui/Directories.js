import { useEffect, useState } from "react";
import { FlatList, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RNFS from "react-native-fs";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ContentFiles, MusicFiles, VideoFiles } from "./RenderFiles";

const VIDEO_EXTENSIONS = [
  'mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm',
  'm4v', '3gp', '3g2', 'mpeg', 'mpg', 'ts', 'mts',
  'm2ts', 'vob', 'ogv', 'rm', 'rmvb', 'asf', 'divx',
];

const AUDIO_EXTENSIONS = [
  'mp3', 'wav', 'aac', 'flac',
  'ogg', 'm4a', 'wma'
];


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

export default function FileDirectories({title, root}) {
  const [contents, setContents] = useState([])
  const navigation = useRouter()

  const navigateBack = () => {
    navigation.back()
  }

  useEffect(() => {
    async function listDirectories() {
      try {
        const permission = await requestStoragePermission()
        if (!permission) return 
        
        const items = await RNFS.readDir(root)
        setContents(items)
      } catch (error) {
        console.log(error)          
      }
    }

    listDirectories()
  },[])

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
          const type = splitPath[splitPath.length-1]

          return <ContentFiles isDirectory={item.isDirectory()} fileType={type} fileName={item.name} root={root} />
        }}
      />
    </>
  )
}

export function VideoDirectories({title, root}) {
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
        const videos = items.filter(el => {
          const extension = el.name.split('.').pop().toLowerCase();
          return VIDEO_EXTENSIONS.includes(extension);
        });

        console.log("Fetch videos")

        setContents(videos);
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
          const type = splitPath[splitPath.length-1]

          return <VideoFiles isDirectory={item.isDirectory()} fileType={type} fileName={item.name} root={root} />
        }}
      />
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

        console.log("Fetch videos")

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
          const type = splitPath[splitPath.length-1]

          return <MusicFiles isDirectory={item.isDirectory()} fileType={type} fileName={item.name} root={root} />
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
      marginBottom: 50,
      width: 330,
      height: "85%",
      marginHorizontal: "auto"
    }
  })
}