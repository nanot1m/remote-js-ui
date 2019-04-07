import { BgColor, FontSize, LineHeight, Radius, Shadow, TextColor } from "./constants";

export const defaultTheme = {
  space: [0, 4, 8, 12, 16, 20, 24, 28, 40, 60],
  colors: {
    [TextColor.Primary]: "#333",
    [TextColor.Secondary]: "#999",
    [TextColor.Link]: "#0044bb",
    [TextColor.LinkHover]: "#dd0000",
    [TextColor.Error]: "#ff0000",
    [TextColor.Success]: "#009900",
    [TextColor.Warn]: "#cc6600",
    [BgColor.White]: "#fff",
    [BgColor.Main]: "#f8f8f8",
    [BgColor.Warn]: "#ffeba0",
    [BgColor.Primary]: "#ffcc00",
    [BgColor.Control]: "#e6e6e6",
    [BgColor.Intent]: "#e5ecf8"
  },
  shadows: {
    [Shadow.Card]:
      "0 0 2px 0 rgba(13, 35, 67, 0.1), 0 3px 8px -3px rgba(13, 35, 67, 0.1)",
    [Shadow.Popup]:
      "0 5px 20px -5px rgba(13, 35, 67, 0.2), 0 10px 40px -5px rgba(13, 35, 67, 0.2)"
  },
  radii: {
    [Radius.Card]: 8
  },
  fontSizes: {
    [FontSize.XS]: 11,
    [FontSize.S]: 13,
    [FontSize.M]: 15,
    [FontSize.L]: 18,
    [FontSize.XL]: 22,
    [FontSize.XXL]: 32
  },
  lineHeights: {
    [LineHeight.XS]: 14,
    [LineHeight.SInset]: 16,
    [LineHeight.S]: 18,
    [LineHeight.M]: 20,
    [LineHeight.L]: 22,
    [LineHeight.XL]: 26,
    [LineHeight.XXL]: 38
  }
} as const;

export type AppDefaultTheme = typeof defaultTheme;
