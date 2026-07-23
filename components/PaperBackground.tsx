import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp, useWindowDimensions } from "react-native";
import Svg, { Defs, Pattern, Circle, Rect } from "react-native-svg";
import { colors } from "@/constants/theme";

interface PaperBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const DOT_SPACING = 22;
const DOT_RADIUS = 1.4;

/**
 * Subtle dotted grid over a warm paper color, matching the collection
 * screen's "field notebook page" background from the reference video.
 * Uses a tiled SVG pattern (one repeating dot cell) rather than hundreds of
 * individual views, so it's cheap to render at any screen size.
 */
export function PaperBackground({ children, style }: PaperBackgroundProps) {
  const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.container, style]}>
      <Svg style={StyleSheet.absoluteFillObject} width={width} height={height}>
        <Defs>
          <Pattern
            id="dotGrid"
            width={DOT_SPACING}
            height={DOT_SPACING}
            patternUnits="userSpaceOnUse"
          >
            <Circle cx={DOT_SPACING / 2} cy={DOT_SPACING / 2} r={DOT_RADIUS} fill={colors.paperDot} />
          </Pattern>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#dotGrid)" />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
});
