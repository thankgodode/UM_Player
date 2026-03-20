// import { View } from "react-native";

// export default function MusicNavHeader() {
//     return (
//         <View>

//         </View>
//     )
// }

import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Albums, Artists, MusicFolders, Songs } from './MusicComponent';

export default function MusicPagerViewer() {
  const [page, setPage] = useState(0)
  const pageRef = useRef(null)
  const styles = style(page)

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
          <Songs/>
        </View>
        <View style={styles.page} key="2">
          <MusicFolders/>
        </View>
        <View style={styles.page} key="3">
          <Albums/>
        </View>
        <View style={styles.page} key="4">
          <Artists/>
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
      <TouchableOpacity onPress={() => {
        pageRef.current?.setPage(2)
        // setPage(3)
      }}>
        <Text
          style={[styles.lableText, { color: page === 2 ? "#000":"#7b7b7b" }]}
        >
          ALBUMS
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
        pageRef.current?.setPage(3)
        // setPage(4)
      }}>
        <Text
          style={[styles.lableText, { color: page === 3 ? "#000" : "#7b7b7b" }]}
        >
          ARTISTS
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
    // justifyContent: 'left',
    // alignItems: 'center',
    // width:200,
    // height: 500,
    flex:1,
    // backgroundColor: "red",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom:15
  },
  labelWrapper: {
    flexDirection: "row",
    justifyContent:"space-between",
    // gap: 10,
    paddingLeft:15,
    paddingRight:15,
    fontFamily: "poppins",
    marginTop: 5,
    padding: 10,
    boxShadow:"1px 7px 10px #cccccc52"
    // backgroundColor:"blue"
  },
  lableText: {
    fontWeight: 600,
    
  }
});