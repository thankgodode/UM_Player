import { useEffect, useState } from "react";
import { FlatList, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RNFS from "react-native-fs";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";


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


export default function Directories({title, root}) {
  const [contents, setContents] = useState([])
  const styles = style()
  const navigation = useRouter()
  

  const navigateBack = () => {
    const pathLength = root.split("/").length 

    if (pathLength === 5) {
      navigation.navigate("files")
      return
    }

    navigation.back()
  }

  useEffect(() => {
    async function listDirectories() {
      try {
        const permission = await requestStoragePermission()
        if (!permission) return 
        
        // const path = RNFS.ExternalStorageDirectoryPath
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
        contentContainerStyle={{marginBottom:20}}
        renderItem={({ item }) => {
          const path = item.path
          const splitPath = path.split(".")
          const type = splitPath[splitPath.length-1]

          return <Contents isDirectory={item.isDirectory()} fileType={type} fileName={item.name} root={root} />
        }}
      />
    </>
  )
}

export function Contents({ isDirectory, fileType, fileName,root }) {
  const styles = style()
  return (    
    isDirectory ?
      (
        <Link
          href={{
            pathname: `folder/storage/emulated/0/${fileName}`,
            params: {
              title: fileName,
              path:`${root}/${fileName}`
            }
          }}
          asChild
        >
          <TouchableOpacity style={styles.button}>
            {isDirectory  && <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c" />}
            {fileType ==="pdf" && <MaterialCommunityIcons name="file-pdf-box" size={25} color="#9c9c9c" />}
            {fileType === "mp4" && <MaterialCommunityIcons name="video" size={25} color="#9c9c9c" />}
            {fileType === "mp3" && <MaterialCommunityIcons name="music" size={25} color="#9c9c9c" />}
            {(!["mp3","mp4", "pdf"].includes(fileType) && !isDirectory) && <MaterialCommunityIcons name="file" size={25} color="#9c9c9c" />}
            <View>
              <Text style={styles.name}>{fileName}</Text>
              <Text style={styles.folderInfo}>Placeholder</Text>
            </View>
          </TouchableOpacity>
        </Link>
      ) :
      (
        <TouchableOpacity style={styles.button}>
          {isDirectory  && <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c" />}
          {fileType ==="pdf" && <MaterialCommunityIcons name="file-pdf-box" size={25} color="#9c9c9c" />}
          {fileType === "mp4" && <MaterialCommunityIcons name="video" size={25} color="#9c9c9c" />}
          {fileType === "mp3" && <MaterialCommunityIcons name="music" size={25} color="#9c9c9c" />}
          {(!["mp3","mp4", "pdf"].includes(fileType) && !isDirectory) && <MaterialCommunityIcons name="file" size={25} color="#9c9c9c" />}
          <View>
            <Text style={styles.name}>{fileName}</Text>
            <Text style={styles.folderInfo}>Placeholder</Text>
          </View>
        </TouchableOpacity>
      )     
  )
}

export function VideoDirectories({isDirectory,fileType,fileName,path}) {
   const styles = style()
  return (    
    isDirectory ?
      (
        <Link
          href={{
            pathname: `folder/${path}`,
            params: {
              title: fileName,
              path:`${path}`
            }
          }}
          asChild
        >
          <TouchableOpacity style={styles.button}>
            {isDirectory  && <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c" />}
            {fileType === "video" && <MaterialCommunityIcons name="video" size={25} color="#9c9c9c" />}
            <View>
              <Text style={styles.name}>{fileName}</Text>
              <Text style={styles.folderInfo}>Placeholder</Text>
            </View>
          </TouchableOpacity>
        </Link>
      ) :
      (
        <TouchableOpacity style={styles.button}>
          {isDirectory  && <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c" />}
          {fileType ==="pdf" && <MaterialCommunityIcons name="file-pdf-box" size={25} color="#9c9c9c" />}
          {fileType === "mp4" && <MaterialCommunityIcons name="video" size={25} color="#9c9c9c" />}
          {fileType === "mp3" && <MaterialCommunityIcons name="music" size={25} color="#9c9c9c" />}
          {(!["mp3","mp4", "pdf"].includes(fileType) && !isDirectory) && <MaterialCommunityIcons name="file" size={25} color="#9c9c9c" />}
          <View>
            <Text style={styles.name}>{fileName}</Text>
            <Text style={styles.folderInfo}>Placeholder</Text>
          </View>
        </TouchableOpacity>
      )     
  )
}

function style() {
  return StyleSheet.create({
    header: {
      flexDirection: "row",
      gap:15,
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
      // paddingLeft:15,
      // paddingRight: 15,
      marginBottom:50,
      width: 330,
      // backgroundColor: "red",
      marginHorizontal:"auto"
    },
    button: {
      flexDirection: "row",
      gap: 15,
      paddingTop: 8,
      paddingBottom:8
    },
    name: {
      fontSize: 17,
      fontWeight:400
    },
    folderInfo: {
      color: "grey",
      fontSize:12
    }
  })
}