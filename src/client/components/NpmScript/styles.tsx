import styled from "styled-components";
import { Box } from "client/components/Box";
import { themeGet } from "styled-system";
import { BgColor } from "client/themes/constants";

export const Wrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${themeGet(`colors.${BgColor.Control}`)};
`;

export const Name = styled.h4`
  font-weight: 600;
  margin-bottom: 0;
  margin-top: 0;
`;

export const Header = styled.header`
  display: flex;
  align-items: baseline;
  margin-right: ${themeGet("space.2")}px;
`;
