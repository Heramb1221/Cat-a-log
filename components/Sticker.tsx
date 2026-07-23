import React from "react";
import { Image, View, StyleSheet, ImageStyle, StyleProp } from "react-native";

interface StickerProps {
  uri: string;
  size?: number;
  rotationDeg?: number;
  style?: StyleProp<ImageStyle>;
}

/**
 * Renders a transparent-background cat photo with a "die cut sticker"
 * white outline. React Native has no native stroke-around-alpha filter, so
 * we fake it by stacking the same image, offset in a ring of directions,
 * tinted white via `tintColor`, underneath the real full-color image.
 */
export function Sticker({ uri, size = 220, rotationDeg = 0, style }: StickerProps) {
  const offsets = 12;
  const strokeWidth = Math.max(4, size * 0.035);

  const ghostLayers = Array.from({ length: offsets }, (_, i) => {
    const angle = (i / offsets) * Math.PI * 2;
    const dx = Math.cos(angle) * strokeWidth;
    const dy = Math.sin(angle) * strokeWidth;
    return (
      <Image
        key={i}
        source={{ uri }}
        style={[
          StyleSheet.absoluteFillObject,
          {
            width: size,
            height: size,
            transform: [{ translateX: dx }, { translateY: dy }],
            tintColor: "#FFFFFF",
          },
        ]}
        resizeMode="contain"
      />
    );
  });

  return (
    <View
      style={[
        { width: size, height: size, transform: [{ rotate: `${rotationDeg}deg` }] },
        styles.shadow,
        style,
      ]}
    >
      {ghostLayers}
      <Image
        source={{ uri }}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
