import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Text } from "../ui/text";

export default function VideoNavbar({ title }) {
    const styles = createStyles()
    return (
        <SafeAreaView style={styles.navHeader} edges={['top']}>
            {/* <StatusBar /> */}
            <Text style={{fontSize:20,fontFamily:"poppins", fontWeight:700}}>{title}</Text>
            <View style={styles.top}>
                <Ionicons name="search" size={20} />
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
        </SafeAreaView>
    )
}

function createStyles() {
    return StyleSheet.create({
        navHeader: {
            flexDirection: "row",
            padding: 15,
            justifyContent: "space-between",
            // backgroundColor:"red"
        },
        top: {
            flexDirection: "row",
            width: 75,
            justifyContent: "space-between",
            alignItems:"center"
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