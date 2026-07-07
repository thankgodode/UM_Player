import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { generateThumbnail } from '../utils/generateThumbnail';
import RecentVideoProgressBar from './RecentVideoProgressBar';

export default function VideoScreen({ recents }) {
  
  if (!recents.length) {
    return (
      <View style={styles.noRecent}>
        <Text style={{fontSize:15,textAlign:"center"}}>No recently played videos.</Text>
      </View>
    )
  }

  function formatTime(seconds) {
    const duration = new Date(seconds * 1000).toISOString().substring(11, 19);
    return duration
  }

  return (
    <View style={styles.wrapper}>
    {recents.map((el,i) => {
      return (
        <Link key={i}
          href={{
            pathname: "/videoplayer",
            params: {
              title: el.filename,
              path: el.uri,
              currentTime: el.currentTime
            }
          }}
          asChild
        >
        <TouchableOpacity key={i}>
          <View style={styles.container}>
            <RecentThumbnail uri={el.uri}/>
            <View style={styles.length}>
              <MaterialCommunityIcons name="play" size={19}/>
              <Text style={{color:"white"}}>{formatTime(el.duration)}</Text>
            </View>
            <RecentVideoProgressBar position={el.currentTime} duration={el.duration}/>
          </View>
        </TouchableOpacity>
        </Link>
      )
    })}
  </View>
  );
}

function RecentThumbnail({ uri }) {
  const [thumbnail, setThumbnail] = useState(null)

  useEffect(() => {
    generateThumbnail(uri).then(setThumbnail);
  }, [uri, setThumbnail])
  
  return (
    <>
      {thumbnail ? <Image source={{ uri: thumbnail }} width={100} height={100} style={styles.image} />
        :
        <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
          <MaterialIcons name="video-collection" size={60} color="black" />
        </View>
      }
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    // marginLeft:  15,
    gap: 10,    
  },
  container: {
    // flex: 1,
    marginTop: 5,
    // marginLeft: 15,
    width: 160,
    height: 105,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#e3e3e3",
    position: "relative",
    boxShadow: "1px 2px 5px #eaeaea",
    overflow: "hidden",
    borderRadius:5
    
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode:"cover"
  },
  length: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 4,
    justifyContent: "space-between",
    width: 80,
    position: "absolute",
    bottom: 15,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 2,
    right: 7,
  },
  progressBar: {
    bottom: 0,
    left: 0,
    position:"absolute",
    width: 120,
    backgroundColor: "green",
    padding: 3,
  },
  noRecent: {
    textAlign: "center",
    justifyContent: "center",
    alignItems:"center",
    paddingTop: 30,
    width:350,
    flexDirection:"row"
  }
});
