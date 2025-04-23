import { useEffect } from "react";
import { Image, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/login"); // Navigate to the home screen
    }, 6000);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo_lms.png")} style={{ width: 301, height: 86 }} />
      <ActivityIndicator size="large" color="#8B0000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#8B0000",
  },
});
