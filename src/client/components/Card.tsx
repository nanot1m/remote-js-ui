import styled from "styled-components";

import { Box } from "./Box";
import { BgColor, Shadow } from "client/themes/constants";
import { Radius } from "client/themes/constants";

export const Card = styled(Box)``;

Card.defaultProps = {
  pt: [4, 5],
  px: [3, 5],
  pb: [5, 7],
  boxShadow: Shadow.Card,
  borderRadius: Radius.Card,
  bg: BgColor.White
};
