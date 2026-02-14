import ThemeProvider from "@/components/contexts/ThemeContext";
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  )
}
