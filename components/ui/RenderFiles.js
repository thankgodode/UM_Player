import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { memo } from "react";

const VIDEO_EXTENSIONS = [
  'mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm',
  'm4v', '3gp', '3g2', 'mpeg', 'mpg', 'ts', 'mts',
  'm2ts', 'vob', 'ogv', 'rm', 'rmvb', 'asf', 'divx',
];

const AUDIO_EXTENSIONS = [
    'mp3', 'wav', 'aac', 'flac',
    'ogg', 'm4a', 'wma'
];

function FileIcon({ isDirectory, fileType }) {
  if (fileType === 'pdf')
    return <MaterialCommunityIcons name="file-pdf-box" size={25} color="#9c9c9c" />;
  if (VIDEO_EXTENSIONS.includes(fileType))
    return <MaterialCommunityIcons name="video" size={25} color="#9c9c9c" />;
  if (AUDIO_EXTENSIONS.includes(fileType))
    return <MaterialCommunityIcons name="music" size={25} color="#9c9c9c" />;
  if (fileType==="album")
    return <MaterialCommunityIcons name="album" size={25} color="#9c9c9c" />;
  if (fileType === "artists")
    return ""
  if (isDirectory)
    return <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c" />;
  
  return <MaterialCommunityIcons name="file" size={25} color="#9c9c9c" />;
}

const styles = style();

export function ContentFiles({ isDirectory, fileType, fileName, root }) {
  const content = (
    <>
      <FileIcon isDirectory={isDirectory} fileType={fileType} />
      <View>
        <Text style={styles.name}>{fileName}</Text>
        <Text style={styles.folderInfo}>Placeholder</Text>
      </View>
    </>
  );

  if (isDirectory) {
    return (
      <Link
        href={{
          pathname: `files/folder/storage/emulated/0/${fileName}`,
          params: { title: fileName, path: `${root}/${fileName}` },
        }}
        asChild
      >
        <TouchableOpacity style={styles.button}>{content}</TouchableOpacity>
      </Link>
    );
  }

  return <TouchableOpacity style={styles.button}>{content}</TouchableOpacity>;
}


export const VideoFiles = memo(function VideoFiles({ isDirectory, fileType, fileName, path, count }) {
  const content = (
    <>
      <FileIcon isDirectory={isDirectory} fileType={fileType} />
      <View style={{flexDirection:'row',alignItems:"center",gap:12}}>
        <Text style={styles.name}>{fileName}</Text>
        <Text style={styles.folderInfo}>{count[path]}</Text>
      </View>
    </>
  );

  if (isDirectory) {
    return (
      <Link
        href={{
          pathname: `video/folder/storage/emulated/0/${fileName}`,
          params: { title: fileName, path: `${path}` },
        }}
        asChild
      >
        <TouchableOpacity style={styles.button}>{content}</TouchableOpacity>
      </Link>
    );
  }

  return <TouchableOpacity style={styles.button}>{content}</TouchableOpacity>;
})

export const MusicFiles = memo(function MusicFiles({ isDirectory, fileType, fileName, path,placeholder,count }) {
  const content = (
    <>
      <FileIcon isDirectory={isDirectory} fileType={fileType} />
      <View>
        <Text style={styles.name}>{fileName}  {count}</Text>
        <Text style={styles.folderInfo}>{placeholder||"Placeholder"}</Text>
      </View>
    </>
  );

  if (isDirectory) {
    return (
      <Link
        href={{
          pathname: `music/folder/storage/emulated/0/${fileName}`,
          params: { title: fileName, path: `${path}` },
        }}
        asChild
      >
        <TouchableOpacity style={styles.button}>{content}</TouchableOpacity>
      </Link>
    );
  }

  return <TouchableOpacity style={styles.button}>{content}</TouchableOpacity>;
})

function style() {
  return StyleSheet.create({
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
      fontSize:14
    }
  })
}