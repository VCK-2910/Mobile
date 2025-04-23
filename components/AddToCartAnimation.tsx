
import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StartPosition {
  x: number;
  y: number;
}

export const AddToCartAnimation = ({ startPosition, onComplete }: { startPosition: StartPosition; onComplete?: () => void }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const endX = SCREEN_WIDTH - startPosition.x - 30;
    const endY = -startPosition.y + 50;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: endY,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: endX,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onComplete?.();
    });
  }, [startPosition]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startPosition.x,
        top: startPosition.y,
        transform: [
          { translateX },
          { translateY },
          { scale },
        ],
        opacity,
        backgroundColor: '#0B3B5D',
        width: 40,
        height: 40,
        borderRadius: 20,
        zIndex: 999,
      }}
    />
  );
};
