import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';

interface RotatingPenProps {
  size?: number;
}

/**
 * Stylo plume / crayon satirique officiel GBICH!
 * Basé sur l'asset visuel fourni par l'utilisateur avec rotation 360° infinie garantie.
 */
export const RotatingPen: React.FC<RotatingPenProps> = ({ size = 22 }) => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
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
          Platform.OS === 'web' && ({ animation: 'spin360 2.2s linear infinite' } as any),
        ]}
        {...({ className: 'gbich-rotating-pen' } as any)}
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
