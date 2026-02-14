import { ScrollView, View } from "react-native";
import VideoScreen from "../../components/ui/RecentWatched";
import SlideMenu from "../../components/ui/SlideMenu";
import VideoFolders from "../../components/ui/VideoFolders";
import VideoNavbar from "../../components/ui/VideoNavbar";

export default function Home() {
    return (
        <View>
            <VideoNavbar title="Video"/>
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