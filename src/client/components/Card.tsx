import React from "react";

import { Box } from "./Box";
import { BgColor, Shadow } from "client/themes/constants";
import { Radius } from "client/themes/constants";

interface CardProps {}

export const Card: React.FC<CardProps> = props => {
  return (
    <Box
      pt={[4, 5]}
      px={[3, 5]}
      pb={[5, 7]}
      boxShadow={Shadow.Card}
      borderRadius={Radius.Card}
      bg={BgColor.White}
    >
      {props.children}
    </Box>
  );
};
