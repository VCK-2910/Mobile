import React, { useState, useRef } from "react";
import { TouchableOpacity, Animated, StyleSheet, View } from "react-native";

const CardFlip = ({ frontComponent, backComponent }: any) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    Animated.timing(rotateAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsFlipped(!isFlipped));
  };

  const frontInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={flipCard}>
      {/* Mặt trước */}
      <Animated.View
        style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}
      >
        {frontComponent}
      </Animated.View>

      {/* Mặt sau */}
      <Animated.View
        style={[styles.card, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}
      >
        {backComponent}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    alignSelf: "center",
    width: "100%",
    height: 160,
  },
  card: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backfaceVisibility: "hidden",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBack: {
    backgroundColor: "white",
  },
});

export default CardFlip;
