// components/ProfileCard.tsx
import { useGlobalContext } from "@/context/GloballProvider";
import React from "react";
import { ImageBackground, Text, View, StyleSheet } from "react-native";

const ProfileCard = () => {
  const { profile } = useGlobalContext();

  return (
    <ImageBackground
      source={require("../assets/images/logo_lms.png")}
      style={styles.cardFront}
      imageStyle={styles.cardImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.name}>
          {profile?.username ?? "Khách"}
        </Text>
        <Text style={styles.points}>Reward Points: 70.86</Text>
        <Text style={styles.email}>
          {profile?.email ?? ""}
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  cardFront: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    borderRadius: 10,
  },
  overlay: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  points: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
  email: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
});

export default ProfileCard;
