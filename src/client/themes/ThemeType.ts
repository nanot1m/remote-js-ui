import {
  TextColor,
  BgColor,
  Shadow,
  Radius,
  FontSize,
  LineHeight
} from "./constants";

export type ThemeType = {
  space: number[];
  colors: Record<TextColor | BgColor, string>;
  shadows: Record<Shadow, string>;
  radii: Record<Radius, number>;
  fontSizes: Record<FontSize, number>;
  lineHeights: Record<LineHeight, number>;
};
