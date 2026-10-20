import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Platform, ViewStyle } from 'react-native';

interface ThreeDSphereProps {
  size: number;
  style?: ViewStyle;
  floatDelay?: number;
  floatDistance?: number;
  floatDuration?: number;
  colorVariant?: 'red' | 'pearl';
}

/**
 * Sphère 3D laquée avec reflets lumineux, ombre portée réaliste
 * et micro-animation flottante continue (lévitation satirique).
 */
export const ThreeDSphere: React.FC<ThreeDSphereProps> = ({
  size,
  style,
  floatDelay = 0,
  floatDistance = 6,
  floatDuration = 2400,
  colorVariant = 'red',
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    const timeout = setTimeout(() => {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: floatDuration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: floatDuration / 2,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    }, floatDelay);

    return () => {
      clearTimeout(timeout);
      if (animation) animation.stop();
    };
  }, [floatAnim, floatDelay, floatDistance, floatDuration]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -floatDistance],
  });

  const shadowScale = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.82],
  });

  const isRed = colorVariant === 'red';

  return (
    <View style={[styles.wrapper, { width: size, height: size }, style]}>
      {/* Ombre portée douce au sol / derrière */}
      <Animated.View
        style={[
          styles.dropShadow,
          {
            width: size * 0.8,
            height: size * 0.28,
            borderRadius: size * 0.14,
            bottom: -size * 0.15,
            left: size * 0.1,
            backgroundColor: isRed ? 'rgba(168, 15, 28, 0.45)' : 'rgba(23, 20, 22, 0.3)',
            transform: [{ scale: shadowScale }],
          },
        ]}
      />

      {/* Corps principal de la sphère 3D animée */}
      <Animated.View
        style={[
          styles.sphere,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isRed ? '#F5222D' : '#FFFFFF',
            transform: [{ translateY }],
          },
          Platform.OS === 'web' && (isRed ? (webStyles.webRedSphere as any) : (webStyles.webPearlSphere as any)),
        ]}
      >
        {/* Reflet spéculaire principal (brillant laqué 3D) */}
        <View
          style={[
            styles.specularGlint,
            {
              width: size * 0.35,
              height: size * 0.24,
              borderRadius: (size * 0.35) / 2,
              top: size * 0.14,
              left: size * 0.18,
            },
          ]}
        />
        {/* Micro-point lumineux extrême */}
        <View
          style={[
            styles.microHighlight,
            {
              width: size * 0.1,
              height: size * 0.1,
              borderRadius: (size * 0.1) / 2,
              top: size * 0.18,
              left: size * 0.22,
            },
          ]}
        />
        {/* Ombre de bordure inférieure 3D */}
        <View
          style={[
            styles.bottomCrescent,
            {
              width: size,
              height: size * 0.5,
              borderBottomLeftRadius: size / 2,
              borderBottomRightRadius: size / 2,
              backgroundColor: isRed ? 'rgba(74, 2, 9, 0.4)' : 'rgba(150, 144, 147, 0.3)',
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropShadow: {
    position: 'absolute',
    filter: Platform.OS === 'web' ? 'blur(4px)' : undefined,
  },
  sphere: {
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  specularGlint: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    transform: [{ rotate: '-25deg' }],
  },
  microHighlight: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  bottomCrescent: {
    position: 'absolute',
    bottom: 0,
  },
});

const webStyles = {
  webRedSphere: {
    background: 'radial-gradient(circle at 35% 28%, #ff858d 0%, #F5222D 40%, #A80F1C 75%, #4A0209 100%)',
    boxShadow:
      '0 8px 18px rgba(168, 15, 28, 0.45), inset -3px -3px 8px rgba(74, 2, 9, 0.6), inset 2px 2px 5px rgba(255, 255, 255, 0.8)',
  },
  webPearlSphere: {
    background: 'radial-gradient(circle at 35% 28%, #ffffff 0%, #f6f3f0 45%, #dcd9d7 80%, #936e6b 100%)',
    boxShadow:
      '0 4px 10px rgba(23, 20, 22, 0.25), inset -2px -2px 6px rgba(0, 0, 0, 0.25), inset 2px 2px 4px rgba(255, 255, 255, 0.9)',
  },
};
