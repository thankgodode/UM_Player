import SelectionProvider from "@/components/contexts/SelectionContext";
import ThemeProvider from "@/components/contexts/ThemeContext";
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SelectionProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <PortalHost />
      </SelectionProvider>
    </ThemeProvider>
  )
}
