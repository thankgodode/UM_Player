import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelection } from "../hooks/useSelection";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Text } from "./text";

export default function ActionBar() {
    const { selectedCount, clearSelection, exitSelectionMode, isSelectionMode } = useSelection();
    const styles = createStyles()

    if (!isSelectionMode || selectedCount === 0) {
        return null; // Don't show action bar if not in selection mode or nothing is selected
    }

    return (
        <View style={styles.navHeader}>
            {/* <StatusBar /> */}
            <View style={{ flexDirection: 'row', alignItems:"center", gap:25,flex:1}}>
                <TouchableOpacity onPress={exitSelectionMode}>
                    <MaterialCommunityIcons name="close" size={24} />
                </TouchableOpacity>
                <Text style={{fontSize:17, fontWeight:400}}>{selectedCount} selected</Text>
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
                                <MaterialCommunityIcons name="select-all" size={20} />
                                <Text>Select All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.optionMenu} onPress={exitSelectionMode}>
                                <MaterialCommunityIcons name="selection-remove" size={20}/>
                                <Text>Clear Selection</Text>
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