import React from "react";
import { render } from "react-dom";
import { findElementById } from "client/findElementById";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { Main } from "client/views/Main";
import { defaultTheme } from "client/themes/defaultTheme";
import {
  BgColor,
  FontSize,
  LineHeight,
  TextColor
} from "client/themes/constants";
import { themeGet } from "styled-system";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    min-height: 100%;
    background-color: ${themeGet(`colors.${BgColor.Main}`)};
    font-family: 'Open Sans', sans-serif;
    font-size: ${themeGet(`fontSizes.${FontSize.M}`)}px;
    line-height: ${themeGet(`lineHeights.${LineHeight.M}`)}px;
    color: ${themeGet(`colors.${TextColor.Primary}`)};
  }
  
  body {
    margin: 0;
  }
`;

render(
  <ThemeProvider theme={defaultTheme}>
    <>
      <Main />
      <GlobalStyle />
    </>
  </ThemeProvider>,
  findElementById("app", HTMLElement)
);
