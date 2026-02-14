// import { useEffect, useState } from 'react';
// import { Image, StyleSheet, View } from 'react-native';
// import { createThumbnail } from "react-native-create-thumbnail";

// export default function VideoScreen() {
//   const [thumbnail, setThumbnail] = useState(null);

//   useEffect(() => {
//     generateThumbnail();
//   }, []);

//   const generateThumbnail = async () => {
//     try {
//       await createThumbnail({
//           url: 'https://www.w3schools.com/html/mov_bbb.mp4',
//           timeStamp:3000
//       });
      
//     //   setThumbnail(uri);
//     } catch (e) {
//       console.warn("Error: ", e);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {thumbnail && (
//         <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { alignItems: 'center' },
//   thumbnail: { width: 300, height: 200 },
// });

import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VideoScreen() {
  const [image, setImage] = useState(null);
  const arr = [1,2,3,4,5,6]

  const generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        'https://www.w3schools.com/html/mov_bbb.mp4',
        {
          time: 15000,
        }
        );
        console.log(uri)
      setImage(uri);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={styles.wrapper}>
    {arr.map((el,i) => {
      return (
        <TouchableOpacity key={i}>
          <View style={styles.container}>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <View style={styles.length}>
              <MaterialCommunityIcons name="play" size={19}/>
              <Text>24:00</Text>
            </View>
            <View style={styles.progressBar}></View>
          </View>
        </TouchableOpacity>
      )
    })}
  </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    marginLeft: 15,
    gap:10,
    
  },
  container: {
    // flex: 1,
    marginTop: 20,
    // marginLeft: 15,
    width: 160,
    height: 105,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#e3e3e3",
    position: "relative",
    boxShadow:"1px 2px 5px #eaeaea"
  },
  image: {
    width: 200,
    height: 200,
  },
  length: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 4,
    justifyContent: "space-between",
    width: 70,
    position: "absolute",
    bottom: 15,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 2,
    right:7
  },
  progressBar: {
    bottom: 0,
    left: 0,
    position:"absolute",
    width: 120,
    backgroundColor: "green",
    padding: 3,
  }
});
