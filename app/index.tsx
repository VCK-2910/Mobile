import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';

import Loader from "../components/Loader";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../context/GloballProvider";

const Welcome: React.FC = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/(tabs)/Home" />;

  return (
    <SafeAreaView style={styles.container}>
      <Loader isLoading={loading} />

      
        <View style={styles.innerContainer}>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/login")}
            containerStyles={styles.button}
            isLoading={loading}
          />
        </View>

      <StatusBar backgroundColor="#fff" style="dark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  button: {
    marginTop: 20,
  },
});

export default Welcome;
