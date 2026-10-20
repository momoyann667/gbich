import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface RotatingPenProps {
  size?: number;
}

/**
 * Stylo plume / crayon satirique officiel GBICH!
 * Basé sur l'asset visuel fourni par l'utilisateur avec vibration / rotation 360° infinie.
 */
export const RotatingPen: React.FC<RotatingPenProps> = ({ size = 22 }) => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.Image
        source={require('../../../assets/pen_icon.png')}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            transform: [{ rotate: spin }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
