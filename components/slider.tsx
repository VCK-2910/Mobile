// components/SliderComponent.tsx
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

const { width } = Dimensions.get("window");

const DATA = [
  { id: "1", src: require("../assets/images/slider_1.png") },
  { id: "2", src: require("../assets/images/slider_2.png") },
  { id: "3", src: require("../assets/images/slider_3.png") },
];

const DOT_SIZE = 8;

const SliderComponent: React.FC = () => {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  /* ---------- auto‑scroll ---------- */
  useEffect(() => {
      let timer: NodeJS.Timeout | number;
    // Delay the start of auto-scroll
    const startTimer = () => {
      timer = setInterval(() => {
        const next = (index + 1) % DATA.length;
        if (listRef.current) {
          listRef.current.scrollToIndex({ index: next, animated: true });
          setIndex(next);
        }
      }, 6000);
    };

    // Start timer after a brief delay
    const timeoutId = setTimeout(startTimer, 100);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(timer);
    };
  }, [index]);

  /* ---------- helper để tránh crash scrollToIndex ---------- */
  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(page);
  };

  return (
    <View style={styles.wrap}>
      <Animated.FlatList
        ref={listRef}
        data={DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={onScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.src} style={styles.image} />
          </View>
        )}
      />

      {/* dots */}
      <View style={styles.pagination}>
        {DATA.map((_, i) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (i - 1) * width,
              i * width,
              (i + 1) * width,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i}
              style={[styles.dot, { opacity }]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default SliderComponent;

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
  slide: { width, justifyContent: "center", alignItems: "center" },
  image: {
    width: width * 0.9,
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#007bff",
    marginHorizontal: 4,
  },
});
