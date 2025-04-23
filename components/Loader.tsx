import React from "react";
import { View, ActivityIndicator, Dimensions, Platform, StyleSheet } from "react-native";

const Loader = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;

  return (
    <View style={[styles.overlay, { height: Dimensions.get("screen").height }]}>
      <ActivityIndicator
        animating={isLoading}
        color="#fff"
        size={Platform.OS === "ios" ? "large" : 50}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)", 
    zIndex: 10,
  },
});

export default Loader;
