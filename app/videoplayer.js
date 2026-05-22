import { useLocalSearchParams } from "expo-router";
import RNFS from "react-native-fs";

import { useEffect, useState } from "react";
import { VIDEO_EXTENSIONS } from "../components/constants/formats";
import VideoPlayer from "../components/ui/VideoPlayer";

export default function VideoPlayerPage({url}) {
    const { path, folder } = useLocalSearchParams()
    const [uris,setUris] = useState([])

    useEffect(() => {
        async function getVideoFiles() {
            try {
                const items = await RNFS.readDir(folder);
                const videos = items.filter(el => {
                    const extension = el.name.split('.').pop().toLowerCase();
                    return VIDEO_EXTENSIONS.includes(extension);
                });

                const arr = []
                videos.forEach((el, i) => {
                    arr.push(el.path)
                })
                setUris(arr)
                
            } catch (error) {
                console.log(error);
            }
        }

        getVideoFiles();
    }, [folder]);

    return uris.length > 0 && (
        <VideoPlayer
            // title={title}
            source={{ uri: path }}
            playlist={uris}
            startIndex={uris.findIndex(item => item === path)}
        />
        // <Text>{path}</Text>
    )
}