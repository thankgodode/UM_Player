import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import FileDirectories from "../../components/ui/Directories";

export default function FileScreen() {
     const { path, title } = useLocalSearchParams()
    console.log("Root ", path)
    console.log("Title ", title)

    return (
        <View>
            <FileDirectories root={path ? path : "/storage/emulated/0"} title={title ? title : "Internal Storage"} />
        </View>
    )
}
