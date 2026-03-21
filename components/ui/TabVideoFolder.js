import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { VideoFiles } from "./RenderFiles";


export default function VideoFolders() {
    const [videoPaths, setVideoPaths] = useState([])

    const styles = createStyles()
    
    const requestPermission = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync()
        
        if (status !== "granted") {
            console.log("Permission not granted")
            return false
        }

        return true
    }
    
    const getVideoFolders = async () => {
        const hasPermission = await requestPermission()
        if (!hasPermission) return
        
        const media = await MediaLibrary.getAssetsAsync({
            mediaType: "video",
            first:2000
        })

        const folders = new Set();

        media.assets.forEach((asset) => {
            const root = asset.uri.split("/").filter((el,i)=>el!=="" && i!==0)
            const arrayPath = root.slice(0,root.length-1)
            const uri = arrayPath.join("/")

            folders.add(uri)
        })

        console.log(folders)
        setVideoPaths(Array.from(folders))
    }

    useEffect(() => {
        getVideoFolders()
    },[])

    return (
        <View
            style={{
                // height: 500,
                marginLeft: 15,
                marginRight: 15,
            }}
        >
            <View style={styles.top}>
                <Text>{videoPaths.length}</Text>
                <TouchableOpacity><MaterialCommunityIcons name="sort" size={20} /></TouchableOpacity>
            </View>
            <FlatList
                data={videoPaths}
                style={styles.flatList}
                contentContainerStyle={{paddingBottom:20}}
                renderItem={({ item }) => {
                    const path = item.split("/")
                    const pathName = path[path.length-1]

                    return <VideoFiles isDirectory={true} fileType={""} fileName={pathName} path={item} />
                }}
            />
        </View>
    )
}

function createStyles() {
    return StyleSheet.create({
        container: {
            paddingBottom:20,
        },
        top: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
            marginTop: 20,
            
        },
        folder: {
            flexDirection: "row",
            alignItems: "center",
            gap: 15
        },
        foldersWrapper: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
        },
        flatList: {
            width: 330,
            height:350,
            marginHorizontal:"auto"
        },
    })
}