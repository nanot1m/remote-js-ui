import { Box } from "@rebass/grid";
import styled from "styled-components";
import { Card } from "client/components/Card";
import { themeGet, defaultBreakpoints } from "styled-system";

export const Layout = styled(Box)`
  display: flex;
  flex: 1;
  max-height: 100%;
  min-height: 0;
`;

Layout.defaultProps = {
  pt: [1, 5],
  pb: [1, 5]
};

export const Main = styled(Card)`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: stretch;
  min-width: 0;
  max-height: 100%;
  min-height: 0;
`;

Main.defaultProps = {
  ...Card.defaultProps,
  ml: [0, 10]
};

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

export const Side = styled(Card)`
  overflow: scroll;
  min-width: fit-content;
  align-self: flex-start;
  max-height: 100%;
  min-height: 0;

  @media (max-width: ${defaultBreakpoints[0]}) {
    z-index: 1;
    /* display: none; */
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
  ...Card.defaultProps,
  mr: [0, 10],
  mb: [4, 0]
};
