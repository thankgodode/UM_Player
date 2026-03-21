import { ScrollView, View } from "react-native";
import Navbar from "../../components/ui/Navbar";
import VideoScreen from "../../components/ui/RecentWatched";
import SlideMenu from "../../components/ui/SlideMenu";
import VideoFolders from "../../components/ui/TabVideoFolder";

export default function Home() {
    return (
        <View>
            <Navbar title="Video"/>
            <SlideMenu />
            <ScrollView
                style={{marginBottom:15}}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                horizontal={true}

            >
                <VideoScreen />
            </ScrollView>
            
                <VideoFolders />
        </View>
    )
}

// const style = StyleSheet.create({
//     container: {
        
//     }
// })