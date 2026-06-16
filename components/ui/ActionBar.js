import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect } from "react";
import { BackHandler, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelectionContext } from "../contexts/SelectionContext";
import { hideVideo } from "../store/hiddenVideos";
import useVideoStore from "../store/videoStore";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Text } from "./text";

export default function ActionBar() {
    const { path } = useLocalSearchParams()
    const styles = createStyles()

    const { isSelecting, selected, clearSelection } = useSelectionContext();

    const count = selected.size
    const removeVideosFromFolder = useVideoStore((s) => s.removeVideosFromFolder);

    useEffect(() => {
        const backAction = () => { 
            if (isSelecting) {
                clearSelection();
                return true;    
            } else {
                return false
            }
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, [clearSelection, isSelecting])

    async function hideSelectedVideos() {
        try {
            const videos = Array.from(selected.values());
            await Promise.all(videos.map((video) => hideVideo(video)));

            removeVideosFromFolder(path, new Set(selected.keys()));

            clearSelection(); // clear selection after hiding

        } catch (e) {
            console.log("Failed to hide videos:", e);
        }
    }
    
    useFocusEffect(
      useCallback(() => {
        // This runs every time the screen is focused
        // clearSelection();

        // Optionally return a cleanup function
          return () => {
            clearSelection();
          // This runs when leaving the screen
        };
      }, [clearSelection])
    );

    return (
        <View style={styles.navHeader}>
            {/* <StatusBar /> */}
            <View style={{ flexDirection: 'row', alignItems: "center", gap: 25, flex: 1 }}>
                <TouchableOpacity onPress={clearSelection}>
                    <MaterialCommunityIcons name="close" size={24} />
                </TouchableOpacity>
                <Text style={{fontSize:17, fontWeight:400}}>{count} selected</Text>
            </View>
            <View style={styles.top}>
                <TouchableOpacity onPress={hideSelectedVideos}>
                    <MaterialCommunityIcons name="lock" size={20} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="delete" size={20} />
                </TouchableOpacity>
                <Popover>
                    <PopoverTrigger>
                        <MaterialIcons name="more-vert" size={24}/>
                    </PopoverTrigger>
                    <PopoverContent>
                        <View style={styles.popover}>
                            <TouchableOpacity style={styles.optionMenu}>
                                <MaterialCommunityIcons name="select" size={20} />
                                <Text>Select</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.optionMenu}>
                                <MaterialCommunityIcons name="theme-light-dark" size={20}/>
                                <Text>Theme</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.optionMenu}>
                                <MaterialIcons name="refresh" size={20}/>
                                <Text>Refresh</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.optionMenu}>
                                <MaterialIcons name="settings" size={20}/>
                                <Text>Settings</Text>
                            </TouchableOpacity>
                        </View>
                    </PopoverContent>
                </Popover>
            </View>
        </View>
    )
}

function createStyles() {
    return StyleSheet.create({
        navHeader: {
            flexDirection: "row",
            padding: 15,
            marginTop:10,
            justifyContent: "space-between",
            alignItems:"center",
        },
        top: {
            flexDirection: "row",
            width: 120,
            justifyContent: "space-between",
            alignItems: "center",
        },
        popover: {
            boxShadow: "1px 8px 7px rgba(0,0,0,0.1)",
            padding: 15,
            backgroundColor: "white",
            width:170,
            rowGap:20,
        },
        optionMenu: {
            flexDirection: "row",
            alignItems: "center",
            gap:7
        }
    })
}