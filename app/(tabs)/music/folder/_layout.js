import { Stack } from "expo-router";

export default function MusicStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: "Music",
        }}
      />
      <Stack.Screen 
        name="folder/[...slug]" 
        options={{
          title: "Folder",
          animationEnabled: true,
        }}
      />
    </Stack>
  );
}