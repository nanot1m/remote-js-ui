import React from "react";
import styled from "styled-components";

const StyledListItem = styled.li``;

const StyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  ${StyledListItem}:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.space[2]}px;
  }
`;

export function List(props: { children: React.ReactNode }) {
  return <StyledList>{props.children}</StyledList>;
}

List.Item = StyledListItem;
