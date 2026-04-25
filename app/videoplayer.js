import { useLocalSearchParams } from "expo-router"
import VideoPlayer from "../components/ui/VideoPlayer"

export default function VideoPlayerPage({url}) {
    const { path,title } = useLocalSearchParams()
    return (
        <VideoPlayer title={title} source={{ uri: path }}/>
        // <Text>{path}</Text>
    )
}