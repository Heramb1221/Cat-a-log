import "react-native-gesture-handler";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="result"
          options={{ presentation: "card", animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="catalog" options={{ animation: "slide_from_bottom" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
