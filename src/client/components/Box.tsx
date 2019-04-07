import styled from "styled-components";
import {
  color,
  ColorProps,
  space,
  SpaceProps,
  width,
  WidthProps,
  fontSize,
  FontSizeProps,
  borderRadius,
  BorderRadiusProps,
  boxShadow,
  BoxShadowProps,
  maxWidth,
  MaxWidthProps
} from "styled-system";

type BoxProps = ColorProps &
  SpaceProps &
  WidthProps &
  FontSizeProps &
  BorderRadiusProps &
  BoxShadowProps &
  MaxWidthProps;

export const Box = styled.div<BoxProps>`
  ${color}
  ${space}
  ${width}
  ${fontSize}
  ${borderRadius}
  ${boxShadow}
  ${maxWidth}
`;
