import * as MediaLibrary from "expo-media-library";
import { requestPermissionsAsync } from "expo-music-library";
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNFS from "react-native-fs";
import PagerView from 'react-native-pager-view';
import { AUDIO_EXTENSIONS } from "../constants/formats";
import { MusicFolders, Songs } from './MusicComponent';

let cachedPaths = null


export default function MusicPagerViewer() {
  const [musicPaths, setMusicPaths] = useState(cachedPaths ?? []);
  const [musics, setMusics] = useState([]);
  const [musicCounts, setMusicCounts] = useState({})
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0)
  const pageRef = useRef(null)
  const styles = style(page)

  async function getMusicCountInFolder(directoryPath) {
    const items = await RNFS.readDir(directoryPath);
    const videoFiles = items.filter(item => {
      if (item.isDirectory()) return false;
      const extension = item.name.split('.').pop().toLowerCase();
      return AUDIO_EXTENSIONS.includes(extension)
    });

    return videoFiles.length;
  }

  
  const getMusics = async () => {
    setLoading(true);

    const hasPermission = await MediaLibrary.requestPermissionsAsync();

    if (hasPermission.status !== "granted") {
      setLoading(false);
      console.warn("Permission not granted for media library");
      return [];
    }

    try {
      const assets = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
        first: 2000,
      });

      const songUris = assets.assets.map((asset) => asset.uri);
      setMusics(songUris);
      setLoading(false)

      return songUris;
    } catch (error) {
      setLoading(false);
      console.error("Error fetching songs:", error);
      return [];
    }
  };

  const getMusicFolders = useCallback(async () => {
    setLoading(true);

    if (cachedPaths) return

    const hasPermission = await requestPermissionsAsync()

    if (!hasPermission) return

    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
        first:2000
      })
  
      const songs = new Set();
  
      media.assets.forEach((asset) => {
        const root = asset.uri.split("/").filter((el,i)=>el!=="" && i!==0)
        const arrayPath = root.slice(0,root.length-1)
        const uri = arrayPath.join("/")
  
        songs.add(uri)
      })
      
      cachedPaths = Array.from(songs)
      setMusicPaths(cachedPaths)

      const counts = {};
      for(const folderPath of cachedPaths){
        counts[folderPath] = await getMusicCountInFolder(folderPath);
      }
      setMusicCounts(counts)

    } catch (error) {
      setLoading(false);
      console.error("Error fetching songs:", error);
      return [];
    }
  },[])

  useEffect(() => {
    getMusicFolders();
  }, [getMusicFolders]);
  
  useEffect(() => {
    getMusics();
  },[])


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LabelPager page={page} setPage={setPage} pageRef={pageRef}/>
      <PagerView
        style={styles.container}
        initialPage={page}
        ref={pageRef}
        onPageSelected={(e) => {
          setPage(e.nativeEvent.position)
        }}
        
      >
        <View style={styles.page} key="1">
          <Songs paths={musics} />
        </View>
        <View style={styles.page} key="2">
          <MusicFolders paths={musicPaths} count={musicCounts} />
        </View>
      </PagerView>
    </View>
  );
}

function LabelPager({ page, setPage, pageRef }) {
  const styles = style(page)
  return (
    <View style={styles.labelWrapper}>
      <TouchableOpacity onPress={() => {
        pageRef.current?.setPage(0)
        // setPage(1)
      }}>
        <Text
          style={[styles.lableText, { color: page === 0 ? "#000":"#7b7b7b" }]}
        >
          SONGS
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        pageRef.current?.setPage(1)
        // setPage(2)
      }}>
        <Text
          style={[styles.lableText, { color: page === 1 ? "#000":"#7b7b7b" }]}
        >
          FOLDERS
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const style  =(page)=> StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex:1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom:15
  },
  labelWrapper: {
    flexDirection: "row",
    justifyContent:"space-around",
    paddingLeft:15,
    paddingRight:15,
    fontFamily: "poppins",
    marginTop: 5,
    padding: 10,
    boxShadow:"1px 7px 10px #cccccc52"
  },
  lableText: {
    fontWeight: 600,
  }
});