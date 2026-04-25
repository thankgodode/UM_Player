// import SwipeToggle from "../../components/ui/MusicNavHeader";
import { StyleSheet, View } from "react-native";
import SelectionProvider from "../../../../components/contexts/SelectionContext";
import MusicPagerViewer from "../../../../components/ui/MusicPagerViewer";
import Navbar from "../../../../components/ui/Navbar";

export default function Music() {
    return (
        <View style={styles.container}>
        <SelectionProvider>
            <Navbar title="Music" />
            {/* {isSelecting && <ActionBar/>}   */}
            <MusicPagerViewer/>
        </SelectionProvider>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})