import React from "react";
import styled from "styled-components";
import { themeGet } from "styled-system";
import { BgColor } from "client/themes/constants";
import { Button } from "client/components/Button";

interface TabsProps {
  children?: React.ReactNode;
}

export function Tabs(props: TabsProps) {
  return <StyledTabs>{props.children}</StyledTabs>;
}

interface TabProps {
  children?: React.ReactNode;
  active?: boolean;
  onClick?: React.MouseEventHandler;
}

Tabs.Tab = function Tab(props: TabProps) {
  return (
    <StyledTab active={props.active} onClick={props.onClick}>
      {props.children}
    </StyledTab>
  );
};

const StyledTab = styled(Button)<{ active?: boolean }>`
  border-radius: 0;
  background-color: ${props =>
    props.active
      ? themeGet(`colors.${BgColor.White}`)(props)
      : themeGet(`colors.${BgColor.Control}`)(props)};
`;

const StyledTabs = styled.div`
  display: flex;
  overflow: auto;

  ${StyledTab}:not(:first-child) {
    margin-left: ${themeGet(`space.1`)}px;
  }
`;
