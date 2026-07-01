import ThemeProvider from "@/components/contexts/ThemeContext";
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from "expo-router";
// import TrackPlayer from "react-native-track-player";


// TrackPlayer.registerPlaybackService(() => require("../components/utils/service"));

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="videoplayer" options={{ headerShown: false }} />
        <Stack.Screen name="hidden" options={{ headerShown: false }} />
      </Stack>
      <PortalHost />
      
    </ThemeProvider>
  )
}
