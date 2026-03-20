import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"

import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function MusicComponent() {
    return (
        <View>

        </View>
    )
}

export function Songs() {
    const arr = "Dream it possible"
    return (
        <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={false}
        >
            {arr.split("").map((el,i) => {
                return (
                    <TouchableOpacity style={styles.list} key={i}>
                        <View>
                            <Text>{el}</Text>
                        </View>
                        <TouchableOpacity>
                            <MaterialIcons name="more-vert" size={24}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            })}
        </ScrollView>
    )
}

export function Albums() {
    const arr = "Dream it possible"
    return (
        <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={false}
        >
            {arr.split("").map((el,i) => {
                return (
                    <TouchableOpacity style={styles.list} key={i}>
                        <View style={styles.folder}>
                            <View style={styles.thumbnailWrapper}>
                                <Image
                                    style={styles.thumbnailImage}
                                    source={require("../../assets/images/splash-icon.png")}
                                />
                            </View>
                            <View>
                                <Text>
                                    {el}{"     "}
                                    <Text style={{fontSize:10,color:"grey"}}>3</Text>
                                </Text>
                                <Text style={styles.artists}>Soul of Africa</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <MaterialIcons name="more-vert" size={24}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            })}
        </ScrollView>
    )
}

export function MusicFolders() {
    const arr = "Dream it possible"
    return (
        <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={false}
        >
            {arr.split("").map((el,i) => {
                return (
                    <TouchableOpacity style={styles.list} key={i}>
                        <View style={styles.folder}>
                            <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                            <Text>{el}</Text>
                        </View>
                        <TouchableOpacity>
                            <MaterialIcons name="more-vert" size={24}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            })}
        </ScrollView>
    )
}

export function Artists() {
  const arr = "Dream it possiblejflksj dlfjs dlfjs ldfjsldjflskjdflsjfl sjdflksjdflsjdfljsldfjlsjdflsldjflsjdflsjldfjsldjflssjkldfklsjdflsjldfjsldfjskl"
    return (
        <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={false}
        >
            {arr.split("").map((el,i) => {
                return (
                    <TouchableOpacity style={styles.list} key={i}>
                        <View style={styles.folder}>
                            <View>
                                <Text>
                                    {el}{"     "}
                                    <Text style={{fontSize:10,color:"grey"}}>3</Text>
                                </Text>
                                <Text style={styles.artists}>Soul of Africa</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <MaterialIcons name="more-vert" size={24}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    list: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom:15
    },
    folder: {
         flexDirection: "row",
        alignItems: "center",
        gap: 15
    },
    thumbnailWrapper: {
        width: 40,
        height:40,
    },
    thumbnailImage: {
        width: "100%",
        height:"100%"
    },
    artists: {
        color: "#ccc",
        fontSize:12
    }
})