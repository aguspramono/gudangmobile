import { Stack } from "expo-router";
import { getToken } from './../func/global/authStorage';
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

function Layout() {

  return (
    <Stack>
       <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="loginScreen" options={{ headerShown: false }} />
        <Stack.Screen name="homeScreen" options={{ headerShown: false }} />
         <Stack.Screen name="detailPesanBarang" options={{ headerShown: false }} />
        <Stack.Screen name="pesananScreen" options={{ headerShown: false }} />

    </Stack>
  );
}

export default Layout;
