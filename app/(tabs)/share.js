import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Share() {
    const [screen, setScreen] = useState()

    const styles = style()
    const navigation = useRouter()
    
    const navigateBack = () => {
        navigation.back()
    }

    return (
        <>
        <View style={styles.header}>
            <TouchableOpacity onPress={navigateBack}>
              <Ionicons name="arrow-back" size={24} />
            </TouchableOpacity>
            <View>
                <Text style={styles.title}>Transfer File</Text>
            </View>
        </View>
        <View style={styles.actionBtn}>
          {/* <Link href="/send" asChild> */}
            <TouchableOpacity style={styles.btns} onPress={()=> setScreen("send")}><Text>Send</Text></TouchableOpacity>
          {/* </Link> */}
          {/* <Link href="/receive" asChild> */}
            <TouchableOpacity style={styles.btns} onPress={()=> setScreen("receive")}><Text>Receive</Text></TouchableOpacity>
          {/* </Link> */}
        </View>
        {screen === "send" && <Send setScreen={setScreen} />}
        {screen === "receive" && <Receive setScreen={setScreen} />}
        </>
    )
}

export function Send({setScreen}) {
  const hotspot = true
  const styles = style()
  const back = () => {
    setScreen("home")
  }

  if (hotspot) {
    return (
      <View style={styles.screen}>
        <View style={styles.navigation}>
          <TouchableOpacity onPress={back}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.qrcode}></View>
        <Text>Name</Text>
        <Text>Waiting for receiver</Text>
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <View style={styles.navigation}>
        <TouchableOpacity onPress={back}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.illustration}>
        <Text>Vector Illustration</Text>
      </View>
      <View styles={styles.criteria}>
        <Text>Criteria</Text>
      </View>
    </View>
  )
}

export function Receive({ setScreen }) {
  const wifi = true
  const styles = style()
  const back = () => {
    setScreen("home")
  }

  if (wifi) {
    return(
      <View style={styles.screen}>
        <View style={styles.navigation}>
          <TouchableOpacity onPress={back}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        </View>
        <View>
          <Text>Camera</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <View style={styles.navigation}>
        <TouchableOpacity onPress={back}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.illustration}>
        <Text>Vector Illustration</Text>
      </View>
      <View styles={styles.criteria}>
        <Text>Criteria</Text>
      </View>
    </View>
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
      // paddingTop:20,
      width: 330,
      // backgroundColor: "red",
      marginHorizontal:"auto"
    },
    actionBtn: {
      flexDirection: "row",
      gap: 15,
      paddingTop: 8,
      paddingBottom: 8,
      top: "80%",
      justifyContent: "center",
    },
    name: {
      fontSize: 17,
      fontWeight:400
    },
    folderInfo: {
      color: "grey",
      fontSize:12
    },
    btns: {
      backgroundColor: "skyblue",
      width: 150,
      justifyContent: "center",
      flexDirection: "row",
      padding: 10,
      borderRadius:20
    },
    screen: {
      backgroundColor: "#f7fbff",
      height:"100%",
      bottom:100
    },
    navigation: {
      padding: 15,
      
      
    }
  })
}