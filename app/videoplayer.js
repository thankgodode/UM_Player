import { useLocalSearchParams } from "expo-router";

import useVideoStore from "../components/store/videoStore";
import VideoPlayer from "../components/ui/VideoPlayer";

export default function VideoPlayerPage({url}) {
    const { path, folder, currentTime, location } = useLocalSearchParams()
    
    const videoPlaylist = useVideoStore((s) => s.videoFolders.find((f) => f.path === folder))
    const allVideoPlayList = useVideoStore((s) => s.allVideos)
    const privateVideos = useVideoStore((s) => s.privateVideos); // 👈 single source of truth

    return (
        <VideoPlayer
            // title={title}
            source={{ uri: path }}
            playlist={location === "folder" ? videoPlaylist.videos
                : location === "all" ? allVideoPlayList
                : location === "private"? privateVideos:path}
            startIndex={location==="folder" ? videoPlaylist.videos.findIndex(item => item.uri === path)
                : location === "all" ? allVideoPlayList.findIndex(item => item.uri === path)
                : location==="private" ? privateVideos.findIndex(item => item.hiddenUri === path):""
            }
            resumePlaying={parseInt(currentTime)}
        />
        // <Text>{path}</Text>
    )
}