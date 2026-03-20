import { ScrollView, View } from "react-native";
import VideoFolders from "../../components/ui/Folders";
import Navbar from "../../components/ui/Navbar";
import VideoScreen from "../../components/ui/RecentWatched";
import SlideMenu from "../../components/ui/SlideMenu";

export default function Home() {
    return (
        <View>
            <Navbar title="Video"/>
            <SlideMenu/>
            <ScrollView
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                horizontal={true}

            >
                <VideoScreen />
            </ScrollView>
            <VideoFolders/>
        </View>
    )
}

// const style = StyleSheet.create({
//     container: {
        
//     }
// })