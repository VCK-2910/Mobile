import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


const NotiLayout = () => {

  return (
    <>
      <Stack>
        <Stack.Screen name="Notifications" options={{ headerShown: false,}}/>
      </Stack>

      <StatusBar backgroundColor="#161622" style="dark" />
    </>
  );
};

export default NotiLayout;