import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import Directories from "../../components/ui/Directories";

export default function FolderNavigation() {
    const { path, title, slug } = useLocalSearchParams()
    console.log("Root ", path)
    console.log("Title ", title)
    console.log("Slug ", slug)

    return (
        <View>
            <Directories root={path} title={title} />
        </View>
    )
}