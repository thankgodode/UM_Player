import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler, View } from "react-native";
import FileDirectories from "../../../components/ui/Directories";

export default function FolderNavigation() {
    const { path, title, slug } = useLocalSearchParams()
    const navigation = useRouter()
    console.log("Root ", path)
    console.log("Title ", title)
    console.log("Slug ", slug)

    useEffect(() => {
        const backAction = () => {
            const pathLength = path.split("/").length 

            if (pathLength === 5) {
                navigation.navigate("files")
                return false
            }
        }

        const handler = BackHandler.addEventListener("hardwareBackPress", backAction)

        return () => handler.remove()

    },[])

    return (
        <View>
            <FileDirectories root={path} title={title} />
        </View>
    )
}