import { Box } from "@rebass/grid";
import styled from "styled-components";
import { themeGet, defaultBreakpoints } from "styled-system";
import { Card } from "client/components/Card";

export const Layout = styled(Box)`
  display: flex;
  flex: 1;
  max-height: 100%;
  min-height: 0;
`;

Layout.defaultProps = {};

export const Main = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: stretch;
  min-width: 0;
  max-height: 100%;
  min-height: 0;
`;

Main.defaultProps = {
  ml: [0, 10],
  pt: [1, 5],
  pb: [1, 5]
};

export const MainInner = styled(Card)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const SideToggle = styled.input`
  display: none;

  @media (max-width: ${defaultBreakpoints[0]}) {
    position: fixed;
    display: inline-block;
    top: 10px;
    left: 10px;
    z-index: 2;
  }
`;

export const Side = styled(Box)`
  overflow: scroll;
  min-width: fit-content;
  align-self: flex-start;
  max-height: 100%;
  min-height: 0;

  @media (max-width: ${defaultBreakpoints[0]}) {
    z-index: 1;
    position: fixed;
    top: ${themeGet("space.1")}px;
    left: ${themeGet("space.1")}px;
    right: ${themeGet("space.1")}px;
    bottom: ${themeGet("space.1")}px;
    margin: 0;
    transition: transform 0.2s ease-out;
    transform: translateX(-150%);

    ${SideToggle}:checked + & {
      display: block;
      transform: translateX(0);
    }
  }
`;

Side.defaultProps = {
  pt: [1, 5],
  pb: [1, 5],
  pr: [0, 10],
  mb: [4, 0]
};
