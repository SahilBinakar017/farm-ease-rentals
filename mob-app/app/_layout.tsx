import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth screens */}
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />

      {/* App (tabs) */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
