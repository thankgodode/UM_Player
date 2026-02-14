import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Easing, Platform } from "react-native";
import { useTheme } from "../../components/hooks/useTheme";

export default function TabLayout() {
    const { theme } = useTheme()
    
const config = {
  animation: 'spring',
  config: {
    duration: 100,
    easing: Easing.inOut(Easing.ease),
  },
};
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.tint,
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
                name="music"
                options={{
                    title: 'Music',
                    tabBarIcon: ({ color,focused }) => <Feather size={focused ? 30:25} name="music" color={color} />,
                }}
            />
            <Tabs.Screen
                name="files"
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
        // <NativeTabs>
        //     <NativeTabs.Trigger name="index">
        //         <Label>Video</Label>
        //         <Icon src={<VectorIcon family={FontAwesome} name="video-camera"/>}/>
        //     </NativeTabs.Trigger>
        //     <NativeTabs.Trigger name="music">
        //         <Label>Music</Label>
        //         <NativeTabs.Trigger.Icon sf="house.fill" md="home"/>
        //     </NativeTabs.Trigger>
        // </NativeTabs>
    )
}