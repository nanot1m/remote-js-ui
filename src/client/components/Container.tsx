import { Box } from "client/components/Box";
import React from "react";

export const Container: React.FC = props => {
  return (
    <Box ml={[1, "auto"]} mr={[1, "auto"]} px={[0, 5]} maxWidth={1000}>
      {props.children}
    </Box>
  );
};
