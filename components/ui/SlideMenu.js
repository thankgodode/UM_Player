import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelectionContext } from "../contexts/SelectionContext";

export default function SlideMenu({ toggleMenu, setToggleMenu }) {
    const {clearSelection} = useSelectionContext()
    const styles = createStyle()
    return (
        <ScrollView contentContainerStyle={styles.slider} horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
                onPress={() => {
                    setToggleMenu("all_videos")
                    clearSelection()
                }}
                style={[styles.btn, toggleMenu === "all_videos" ? { backgroundColor: "rgb(97, 149, 177)" } : ""]}>
                <MaterialIcons name="play-circle" size={18} color={toggleMenu==="all_videos" ?"rgb(199, 215, 224)": "rgb(122, 120, 120)"}/>
                <Text style={[styles.text, toggleMenu==="all_videos"?{color:"white"}:"black"]}>
                    All Videos
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    setToggleMenu("all_folders")
                    clearSelection()
                }}
                style={[styles.btn, toggleMenu === "all_folders" ? { backgroundColor: "rgb(97, 149, 177)" } : ""]}>
                <MaterialIcons name="folder" size={18} color={toggleMenu==="all_folders" ?"rgb(199, 215, 224)": "rgb(122, 120, 120)"}/>
                <Text style={[styles.text, toggleMenu==="all_folders"?{color:"white"}:"black"]}>
                    All Folders
                </Text>
            </TouchableOpacity>
            <Link
                href={{ pathname: "/hidden" }}
                asChild
            >
                <TouchableOpacity style={styles.btn}>
                    <MaterialIcons name="privacy-tip" size={18} color="rgb(122, 120, 120)"/>
                    <Text style={styles.text}>Privacy</Text>
                </TouchableOpacity>
            </Link>
                
        </ScrollView>
    )
}

function createStyle(toggleMenu) {
    return StyleSheet.create({
        slider: {
            flexDirection: "row",
            gap: 5,
            justifyContent: 'center',
            paddingLeft: 15,
            paddingRight: 15,
            marginTop:15
        },
        btn: {
            backgroundColor: "rgb(234, 234, 234)",
            // width: 120,
            paddingLeft: 13,
            paddingRight: 13,
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            borderRadius: 20,
            justifyContent:"space-evenly"
        },
        text: {
            
        }
    })
}