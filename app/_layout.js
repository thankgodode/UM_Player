
import ThemeProvider from "@/components/contexts/ThemeContext";
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>

      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="videoplayer" options={{ headerShown: false }} />
        <Stack.Screen name="hidden" options={{ headerShown: false }} />
      </Stack>
      <PortalHost />
      </GestureHandlerRootView>
    </ThemeProvider>
  )
}
