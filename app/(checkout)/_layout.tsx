import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


const CheckoutLayout = () => {

  return (
    <>
      <Stack>
      <Stack.Screen name="checkout" options={{ headerShown: false,}}/>
        <Stack.Screen name="ordersuccess" options={{ headerShown: false,}}/>
      </Stack>
      <StatusBar backgroundColor="auto" style="auto" />
    </>
  );
};

export default CheckoutLayout;