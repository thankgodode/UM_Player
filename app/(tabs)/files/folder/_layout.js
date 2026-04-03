import { Stack } from "expo-router";

export default function FilesLayout() {
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
          title: "File",
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