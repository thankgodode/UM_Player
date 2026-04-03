// import SwipeToggle from "../../components/ui/MusicNavHeader";
import { usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";
import MusicPagerViewer from "../../../../components/ui/MusicPagerViewer";
import Navbar from "../../../../components/ui/Navbar";

export default function Music() {
        console.log(usePathname())
    const styles = style()
    return (
        <View style={styles.container}>
            <Navbar title="Music"/>
            <MusicPagerViewer/>
        </View>
        
    )
}

function style() {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
    })
}