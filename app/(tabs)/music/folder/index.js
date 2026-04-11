// import SwipeToggle from "../../components/ui/MusicNavHeader";
import { StyleSheet, View } from "react-native";
import MusicPagerViewer from "../../../../components/ui/MusicPagerViewer";
import Navbar from "../../../../components/ui/Navbar";

export default function Music() {
    return (
        <View style={styles.container}>
            <Navbar title="Music"/>
            <MusicPagerViewer/>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})