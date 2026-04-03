import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler, View } from "react-native";
import FileDirectories from "../../../../components/ui/Directories";

export default function FolderNavigation() {
    const { path, title } = useLocalSearchParams()
    const router = useRouter()
    
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
            <FileDirectories root={path} title={title} />
        </View>
    )
}