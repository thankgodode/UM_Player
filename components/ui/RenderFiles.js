import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { memo, useEffect, useState } from "react";
import { SheetManager } from 'react-native-actions-sheet';
import { generateThumbnail } from "../utils/generateThumbnail";
import { VideoBottomSheet } from "./Action";

const VIDEO_EXTENSIONS = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'm4v', '3gp', '3g2', 'mpeg', 'mpg', 'ts', 'mts', 'm2ts', 'vob', 'ogv', 'rm', 'rmvb', 'asf', 'divx'];
const AUDIO_EXTENSIONS = ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a', 'wma'];

const FILE_TYPE_ICONS = {
  pdf: 'file-pdf-box',
  album: 'album',
  folder: 'folder',
  file: 'file',
  directory: 'folder',
};
const styles = style();

const ICON_SIZE = 35;
const ICON_COLOR = '#9c9c9c';

const VideoThumbnail = ({thumburi,time,duration}) => {
  return (
    <View style={styles.thumbnail}>
      <Image source={{ uri: thumburi }} style={{ width: 60, height: 60 }} />
      <View style={styles.duration}>
        <Text style={styles.durationText}>{duration}</Text>
      </View>
      <View style={styles.playhistory}></View>
    </View>
  )
}

const RowItem = ({ isDirectory, fileName, fileType, type, count, time, subdir, uri,duration }) => {
  return (
    <>
      <View style={styles.fileIconWrapper}>
        <FileIcon isDirectory={isDirectory} fileType={fileType} uri={uri} time={time} duration={duration}/>
      </View>
      <View style={type==="media"?{flexDirection:'row', alignItems:"center",flex:1,gap:12}:{flex:1}}>
        <Text numberOfLines={1} ellipsizeMode="middle" style={styles.name}>
          {fileName}
        </Text>
        {count ? <Text style={styles.folderInfo}>{count}</Text>
          :
          <Text style={styles.folderInfo}>{type === "media" ? count : isDirectory?time+" - "+"("+subdir+")":time}</Text>
        }
      </View>
    </>
  )
}

const RowLink = ({ isDirectory, fileType, fileName, path, count, route,BottomSheet,toggleSelect,enterSelectionMode,isSelecting,selected, children,root}) => {
  return (
    <View style={{paddingTop: 3,paddingBottom:3, flexDirection:'row',alignItems:"center"}}>
      <Link
        href={{
          pathname: isDirectory ?`${route}/${fileName}`:"/videoplayer",
          params: { title: fileName, path: `${path}`,folder:root },
        }}
          asChild
          style={{flex:1}}
          onPress={(e) => {
            if (isSelecting) {
              e.preventDefault();
              toggleSelect(fileName)
            }  
          }}
        >
        <TouchableOpacity
          onLongPress={() => enterSelectionMode(fileName)}
          style={styles.button}
        >
          {children}
        </TouchableOpacity>
      </Link>
        <TouchableOpacity onPress={() => { 
          SheetManager.show('kebab-bottomsheet', {
            payload: { name: fileName },
          });
        }}>
        {isSelecting ?
          <MaterialCommunityIcons name={selected ? "checkbox-marked" : "select"} size={20} />
          :
          <MaterialCommunityIcons name="more" size={20} color="grey" />
        }
        
      </TouchableOpacity>
    </View>
  )
}

function FileIcon({ isDirectory, fileType, uri, time,duration}) {
  const [thumbUri, setThumbUri] = useState(null);

  useEffect(() => {
    if (!VIDEO_EXTENSIONS.includes(fileType)) return;
    generateThumbnail(uri).then(setThumbUri);
  }, [uri, fileType]);

  const iconMap = {
    pdf: FILE_TYPE_ICONS.pdf,
    album: FILE_TYPE_ICONS.album,
    artists: null,
  };

  if (iconMap[fileType]) return (
    <MaterialCommunityIcons
      name={iconMap[fileType]}
      size={ICON_SIZE}
      color={fileType === 'pdf' ? 'red' : ICON_COLOR}
    />
  );

  if (VIDEO_EXTENSIONS.includes(fileType)) {
    return thumbUri
      ? <VideoThumbnail thumburi={thumbUri} time={time} duration={duration} />
      : <MaterialCommunityIcons name="video" size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (AUDIO_EXTENSIONS.includes(fileType)) return (
    <MaterialCommunityIcons name="music" size={ICON_SIZE} color={ICON_COLOR} />
  );

  if (isDirectory) return (
    <View style={{flex:1,width:"100%", padding: 3, borderRadius: 7, backgroundColor: 'rgb(209, 239, 255)', alignItems: 'center', justifyContent: 'center' }}>
      <MaterialCommunityIcons name={FILE_TYPE_ICONS.folder} size={ICON_SIZE} color="rgb(97, 149, 177)" />
    </View>
  );

  return <MaterialCommunityIcons name={FILE_TYPE_ICONS.file} size={ICON_SIZE} color={ICON_COLOR} />;
}

export const ContentFiles = memo(function ContentFiles({ uri, isDirectory, fileType, fileName, root, time, subdir }) {
  if (isDirectory) {
    return (
      <Link
        href={{
          pathname: `files/folder/storage/emulated/0/${fileName}`,
          params: { title: fileName, path: `${root}/${fileName}` },
        }}
        asChild
      >
        <TouchableOpacity style={styles.button}>
          <RowItem
            isDirectory={isDirectory}
            fileName={fileName}
            fileType={fileType}
            type="file"
            time={time}
            subdir={subdir}
          />
        </TouchableOpacity>
      </Link>
    );
  }

  return (
    VIDEO_EXTENSIONS.includes(fileType) ?
      <Link
        href={{
          pathname: "/videoplayer",
          params: { title: fileName, path: `${root}/${fileName}` }
        }}
        asChild
      >
      <TouchableOpacity style={styles.button}>
        <RowItem
          isDirectory={isDirectory}
          fileType={fileType}
          fileName={fileName}
          time={time}
          uri={uri}
        />  
      </TouchableOpacity>
    </Link>
      :
    <TouchableOpacity style={styles.button}>
      <RowItem
        isDirectory={isDirectory}
        fileType={fileType}
        fileName={fileName}
        time={time}
        uri={uri}
      />  
    </TouchableOpacity>
  )
})

export const VideoFiles = memo(function VideoFiles({uri, isDirectory, fileType, fileName, path, count,toggleSelect,enterSelectionMode,isSelecting,selected,root,duration}) {
  return (
    <RowLink
      isDirectory={isDirectory}
      fileType={fileType}
      fileName={fileName}
      path={path}
      count={count}
      route="video/folder/storage/emulated/0"
      BottomSheet={VideoBottomSheet}
      toggleSelect={toggleSelect}
      enterSelectionMode={enterSelectionMode}
      isSelecting={isSelecting}
      selected={selected}
      root={root}
    >
      <RowItem
        isDirectory={isDirectory}
        fileName={fileName}
        fileType={fileType}
        type="media"
        count={count}
        uri={uri}
        duration={duration}
      />
    </RowLink>
  )
})

export const MusicFiles = memo(function MusicFiles({ isDirectory, fileType, fileName, path, count,toggleSelect,enterSelectionMode,isSelecting,selected }) {
  return (
    <RowLink
      isDirectory={isDirectory}
      fileType={fileType}
      fileName={fileName}
      path={path}
      count={count}
      route="music/folder/storage/emulated/0"
      toggleSelect={toggleSelect}
      enterSelectionMode={enterSelectionMode}
      isSelecting={isSelecting}
      selected={selected}
    >
      <RowItem
        isDirectory={isDirectory}
        fileName={fileName}
        fileType={fileType}
        type="media"
        count={count}
      />
    </RowLink>
  )
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
    },
    fileIconWrapper: {
      width: 60,
      height: 60,
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center"
    },
    thumbnail: {
      position:"relative"
    },
    duration: {
      backgroundColor: "rgba(0,0,0,0.5)",
      position: "absolute",
      bottom: 0,
      right: 0,
      padding:3
    },

    durationText: {
      color: "white",
      fontSize: 10,
    },
    playhistory: {
      width: "100%",
      backgroundColor:"green"
    }
  })
}