import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { VideoDirectories } from "../../../components/ui/Directories";

export default function FolderNavigation() {
    const { path, title, slug } = useLocalSearchParams()
    console.log("Root ", path)
    console.log("Title ", title)
    console.log("Slug ", slug)

    return (
        <View>
            <VideoDirectories root={path} title={title} />
        </View>
    )
}