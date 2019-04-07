import styled from "styled-components";
import { color, ColorProps, themeGet } from "styled-system";
import { BgColor, TextColor } from "client/themes/constants";

export const Button = styled.button<ColorProps>`
  ${color};

  padding-top: ${themeGet(`space.1`)}px;
  padding-right: ${themeGet(`space.2`)}px;
  padding-bottom: ${themeGet(`space.1`)}px;
  padding-left: ${themeGet(`space.2`)}px;
  border: 1px solid ${themeGet(`colors.${BgColor.Control}`)};
  background-color: ${themeGet(`colors.${BgColor.White}`)};
  transition: opacity 0.2s ease-in, background-color 0.2s ease-in;
  border-radius: 2px;
  font-size: ${themeGet(`fontSizes.1`)}px;

  &:hover {
    cursor: pointer;
    background-color: ${themeGet(`colors.${BgColor.Control}`)};
  }

  &:active {
    opacity: 0.7;
  }

  &:disabled {
    color: ${themeGet(`colors.${TextColor.Secondary}`)};
  }
`;
