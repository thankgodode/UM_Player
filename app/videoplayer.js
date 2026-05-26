import { useLocalSearchParams, useRouter } from "expo-router";

import { useEffect } from "react";
import { BackHandler } from "react-native";
import useVideoStore from "../components/store/videoStore";
import VideoPlayer from "../components/ui/VideoPlayer";

export default function VideoPlayerPage({url}) {
    const { path, folder } = useLocalSearchParams()
    const navigation = useRouter()
    
    const videoPlaylist = useVideoStore((s) => s.videoFolders.find((f) => f.path === folder))

    useEffect(() => {    
        const backAction = () => {
            navigation.back();
            return true;
        };
    
        const handler = BackHandler.addEventListener("hardwareBackPress", backAction);
        
        return () => handler.remove();
    }, []);

    return (
        <VideoPlayer
            // title={title}
            source={{ uri: path }}
            playlist={folder?videoPlaylist.videos:path}
            startIndex={folder?videoPlaylist.videos.findIndex(item => item.uri === path):0}
        />
        // <Text>{path}</Text>
    )
}