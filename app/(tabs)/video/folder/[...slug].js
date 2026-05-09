import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler, View } from "react-native";
import SelectionProvider from "../../../../components/contexts/SelectionContext";
import { VideoDirectories } from "../../../../components/ui/Directories";

export default function FolderNavigation() {
    const { path, title, slug } = useLocalSearchParams()
    // console.log("Root ", path)
    // console.log("Title ", title)
    // console.log("Slug ", slug)
    const router = useRouter();

    useEffect(() => {
        const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
            if (router.canGoBack()) {
                router.back();
                return true; // ← prevents default behavior (app exit)
            }
            return false;
        });

        return () => subscription.remove();
    }, []);

    return (
        <View>
            <SelectionProvider>
                <VideoDirectories root={path} title={title} />
            </SelectionProvider>
        </View>
    )
}