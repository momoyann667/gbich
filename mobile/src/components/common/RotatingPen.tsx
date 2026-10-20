import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface RotatingPenProps {
  size?: number;
}

/**
 * Stylo plume de caricaturiste rouge officiel GBICH!
 * Tourne en continu sur lui-même (spin 360°) avec animation fluide.
 */
export const RotatingPen: React.FC<RotatingPenProps> = ({ size = 18 }) => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2600,
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
      <Animated.View
        style={[
          styles.penWrapper,
          {
            width: size,
            height: size,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        {/* Corps du stylo plume satirique */}
        <View style={styles.penBody} />
        {/* Bague métallique / encre noire */}
        <View style={styles.penRing} />
        {/* Pointe / Plume de dessin rouge */}
        <View style={styles.penNib} />
        <View style={styles.penNibTip} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  penWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  penBody: {
    width: 4,
    height: 9,
    backgroundColor: '#B70014',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderWidth: 0.8,
    borderColor: '#171416',
  },
  penRing: {
    width: 5,
    height: 1.8,
    backgroundColor: '#FAF7F2',
    borderWidth: 0.6,
    borderColor: '#171416',
  },
  penNib: {
    width: 0,
    height: 0,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#B70014',
  },
  penNibTip: {
    width: 1,
    height: 2,
    backgroundColor: '#171416',
    marginTop: -0.5,
  },
});
