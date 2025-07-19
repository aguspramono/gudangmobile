import { Stack } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { chekPremissionAndGetToken } from "./../func/global/premissionNotif";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function Layout() {
    const checkprem = async() =>{
      await chekPremissionAndGetToken();
    }

  useEffect(() => {
    checkprem();
  }, []);
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="loginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="homeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="detailPesanBarang" options={{ headerShown: false }} />
      <Stack.Screen name="pesananScreen" options={{ headerShown: false }} />
      <Stack.Screen name="orderScreen" options={{ headerShown: false }} />
      <Stack.Screen name="detailOrderBarang" options={{ headerShown: false }} />
      <Stack.Screen name="terimaScreen" options={{ headerShown: false }} />
      <Stack.Screen name="profileScreen" options={{ headerShown: false }} />

    </Stack>
  );
}

export default Layout;
