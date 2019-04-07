import styled from "styled-components";
import { FontSize, LineHeight } from "client/themes/constants";
import { themeGet } from "styled-system";

export const H1 = styled.h1`
  margin-top: 0;
  margin-bottom: ${themeGet(`space.5`)}px;
  font-size: ${themeGet(`fontSizes.${FontSize.XXL}`)}px;
  line-height: ${themeGet(`lineHeights.${LineHeight.XXL}`)}px;
  font-weight: 700;
`;

export const H2 = styled.h2`
  margin-top: 0;
  margin-bottom: ${themeGet(`space.4`)}px;
  font-size: ${themeGet(`fontSizes.${FontSize.XL}`)}px;
  line-height: ${themeGet(`lineHeights.${LineHeight.XL}`)}px;
  font-weight: 700;
`;

export const H3 = styled.h3`
  margin-top: 0;
  margin-bottom: ${themeGet(`space.4`)}px;
  font-size: ${themeGet(`fontSizes.${FontSize.L}`)}px;
  line-height: ${themeGet(`lineHeights.${LineHeight.L}`)}px;
  font-weight: 600;
`;
