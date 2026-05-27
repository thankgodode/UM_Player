import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function SlideMenu() {
    const styles = createStyle()
    return (
        <ScrollView contentContainerStyle={styles.slider} horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.btn}>
                <MaterialIcons name="play-circle" size={18} color="rgb(97, 149, 177)"/>
                <Text style={styles.text}>
                    All Videos
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <MaterialIcons name="folder" size={18} color="rgb(97, 149, 177)"/>
                <Text style={styles.text}>
                    All Folders
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <MaterialIcons name="cleaning-services" size={18} color="rgb(97, 149, 177)"/>
                <Text style={styles.text}>
                    Size
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <MaterialIcons name="privacy-tip" size={18} color="rgb(97, 149, 177)"/>
                <Text style={styles.text}>
                    Privacy
                </Text>
                </TouchableOpacity>
        </ScrollView>
    )
}

function createStyle() {
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
            backgroundColor: "rgb(209, 239, 255)",
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