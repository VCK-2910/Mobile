import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


const ProfileLayout = () => {

  return (
    <>
      <Stack>
        <Stack.Screen name="detail" options={{ headerShown: false,}}/>
        <Stack.Screen name="history" options={{ headerShown: false }} />
        <Stack.Screen name="password" options={{ headerShown: false }} />
        <Stack.Screen name="historybooking" options={{ headerShown: false }} />
        <Stack.Screen name="update" options={{ headerShown: false }} />
      </Stack>

      <StatusBar backgroundColor="auto" style="auto" />
    </>
  );
};

export default ProfileLayout;