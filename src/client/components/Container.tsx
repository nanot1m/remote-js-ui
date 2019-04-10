import styled from "styled-components";
import { Box } from "client/components/Box";

export const Container = styled(Box)`
  height: 100vh;
  max-width: 1240px;
  display: flex;
  flex-direction: column;
`;

Container.defaultProps = {
  ml: [1, "auto"],
  mr: [1, "auto"],
  px: [0, 5]
};
