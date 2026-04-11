import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { BackHandler, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelectionContext } from "../contexts/SelectionContext";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Text } from "./text";

export default function ActionBar() {
    const styles = createStyles()
    const { isSelecting, selected, clearSelection } = useSelectionContext();
    const count = selected.size

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
    },[clearSelection,isSelecting])

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
            width: 70,
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