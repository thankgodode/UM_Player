import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout() {
    // const { theme } = useTheme()
        
    // const config = {
    //     animation: 'spring',
    //     config: {
    //         duration: 100,
    //         easing: Easing.inOut(Easing.ease),
    //     },
    // };

    return (
        <Tabs
            screenOptions={{
                // tabBarActiveTintColor: theme.tint,
                headerShown: false,
                // tabBarButton: HapticTabs,
                // tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                    // Use a transparent background on iOS to show the blur effect
                    // position: 'absolute',
                    },
                    default: {},
                }),
                animation: "shift",
                // transitionSpec: config
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Video',
                    tabBarIcon: ({ color, focused }) => <Entypo size={focused ? 30 : 25} name="video" color={color} />,
                }}
            />
            <Tabs.Screen
                name="video/folder/[...slug]"
                options={{
                    title: 'Video',
                    tabBarIcon: ({ color, focused }) => <Entypo size={focused ? 30 : 25} name="video" color={color} />,
                    href:null
                }}
            />
            <Tabs.Screen
                name="music/folder"
                options={{
                    title: 'Music',
                    tabBarIcon: ({ color,focused }) => <Feather size={focused ? 30:25} name="music" color={color} />,
                }}
            />
            <Tabs.Screen
                name="files/folder"
                options={{
                    title: 'Files',
                    tabBarIcon: ({ color,focused }) => <Feather size={focused ? 30:25}  name="folder" color={color} />,
                }}
            />
            <Tabs.Screen
                name="share"
                options={{
                    title: 'Share',
                    tabBarIcon: ({ color,focused }) => <MaterialCommunityIcons size={focused ? 30:25}  name="share" color={color} />,
                }}
            />
        </Tabs>
    )
}