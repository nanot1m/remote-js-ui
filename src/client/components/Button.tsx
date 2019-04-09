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
  transition: all 0.2s ease-out;
  border-radius: 2px;
  font-size: ${themeGet(`fontSizes.1`)}px;

  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }

  &:active {
    opacity: 0.7;
  }

  &:disabled {
    color: ${themeGet(`colors.${TextColor.Secondary}`)};
  }

  &:focus {
    outline: none;
    border-color: ${themeGet(`colors.${BgColor.Primary}`)};
    box-shadow: inset 0 0 0 1px ${themeGet(`colors.${BgColor.Primary}`)};
  }
`;
