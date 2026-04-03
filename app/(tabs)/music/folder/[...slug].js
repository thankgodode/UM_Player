import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler, View } from "react-native";
import { MusicDirectories } from "../../../../components/ui/Directories";

export default function MusicFolderDetail() {
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
        <View style={{ flex: 1 }}>
            <MusicDirectories root={path} title={title} />
        </View>
    )
}