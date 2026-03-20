import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { VideoDirectories } from "./Directories";


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
                height: 500,
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
                contentContainerStyle={{marginBottom:20}}
                renderItem={({ item }) => {
                    const path = item.split("/")
                    const pathName = path[path.length-1]

                    return <VideoDirectories isDirectory={true} fileType={""} fileName={pathName} path={item} />
                }}
            />
            {/* <ScrollView
                contentContainerStyle={styles.container} 
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity style={styles.foldersWrapper}>
                    <View style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>StatusSaver</Text>
                    </View>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </TouchableOpacity>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>WhatsApp Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>WhatsApp Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>WhatsApp Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>WhatsApp Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>WhatsApp Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
            </ScrollView> */}
        </View>
    )
}

// export function Folders() {
//     return (
//         <FlatList
            
//         />
//     )
// }

function createStyles() {
    return StyleSheet.create({
        container: {
            paddingBottom:20,
            // flexDirection:"column",
        },
        top: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
            marginTop: 35,
            
        },
        folder: {
            flexDirection: "row",
            alignItems: "center",
            gap: 15
        },
        foldersWrapper: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 25,
            // paddingTop:3,
        },
        flatList: {
            // paddingLeft:15,
            // paddingRight: 15,
            // paddingTop:20,
            width: 330,
            // backgroundColor: "red",
            marginHorizontal:"auto"
        },
    })
}