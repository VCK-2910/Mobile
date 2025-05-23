import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import  Loader  from "../../components/Loader";
import { useGlobalContext } from "../../context/GloballProvider";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/(tabs)/Home" />;

  return (
    <>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false,}}/>
        <Stack.Screen name="signup" options={{ headerShown: false }} />
      </Stack>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="auto" style="auto" />
    </>
  );
};

export default AuthLayout;