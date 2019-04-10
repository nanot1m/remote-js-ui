import { Box } from "@rebass/grid";
import styled from "styled-components";
import { Card } from "client/components/Card";

export const Layout = styled(Box)`
  display: flex;
  flex: 1;
  max-height: 100%;
  min-height: 0;
`;

Layout.defaultProps = {
  pt: 5,
  pb: 5
};

export const Main = styled(Card)`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: stretch;
  max-height: 100%;
  min-height: 0;
`;

Main.defaultProps = {
  ...Card.defaultProps,
  ml: [0, 10]
};

export const Side = styled(Card)`
  overflow: scroll;
  min-width: fit-content;
  align-self: flex-start;
  max-height: 100%;
  min-height: 0;
`;

Side.defaultProps = {
  ...Card.defaultProps,
  mr: [0, 10],
  mb: [4, 0]
};
