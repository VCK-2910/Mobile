import React, { useCallback } from "react";
import { SplashScreen, Stack } from "expo-router";
import "react-native-url-polyfill/auto";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CartProvider } from "@/context/cartcontext";
import { GlobalProvider, useGlobalContext } from "../context/GloballProvider";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

// ✋ giữ splash
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { loading } = useGlobalContext();

  const onLayoutRootView = useCallback(async () => {
    if (!loading) {
      await SplashScreen.hideAsync(); // ✅ chỉ ẩn splash khi context xong
    }
  }, [loading]);

  if (loading) return null; // ⏳ vẫn đang check login → giữ splash

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <CartProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(checkout)" options={{ headerShown: false }} />
          <Stack.Screen name="(profile)" options={{ headerShown: false }} />
          <Stack.Screen name="noti" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar backgroundColor="auto" style="auto" />
      </CartProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GlobalProvider>
        <AppContent />
      </GlobalProvider>
    </GestureHandlerRootView>
  );
}
