import { Box } from "@rebass/grid";
import styled from "styled-components";
import React from "react";

export const Main = styled(Box)`
  min-width: 0;
`;

Main.defaultProps = {
  ml: [0, 10],
  flex: "3"
};

export const Side = styled(Box)``;

Side.defaultProps = {
  mr: [0, 10],
  mb: [4, 0],
  flex: "1"
};
