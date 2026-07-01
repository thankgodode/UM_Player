import { useLocalSearchParams } from "expo-router";

import useVideoStore from "../components/store/videoStore";
import VideoPlayer from "../components/ui/VideoPlayer";

export default function VideoPlayerPage({url}) {
    const { path, folder, currentTime } = useLocalSearchParams()
    
    const videoPlaylist = useVideoStore((s) => s.videoFolders.find((f) => f.path === folder))
    const allVideoPlayList = useVideoStore((s) => s.allVideos)

    return (
        <VideoPlayer
            // title={title}
            source={{ uri: path }}
            playlist={folder ? videoPlaylist.videos : allVideoPlayList}
            startIndex={folder ?
                videoPlaylist.videos.findIndex(item => item.uri === path) :
                allVideoPlayList.findIndex(item => item.uri === path)
            }
            resumePlaying={parseInt(currentTime)}
        />
        // <Text>{path}</Text>
    )
}