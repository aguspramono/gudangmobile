import { Stack } from "expo-router";

function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="loginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="homeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="detailPesanBarang" options={{ headerShown: false }} />
      <Stack.Screen name="pesananScreen" options={{ headerShown: false }} />
      <Stack.Screen name="profileScreen" options={{ headerShown: false }} />

    </Stack>
  );
}

export default Layout;
