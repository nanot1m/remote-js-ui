import React from "react";
import styled, { css } from "styled-components";
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
  onCloseClick?: React.MouseEventHandler;
}

Tabs.Tab = function Tab(props: TabProps) {
  return (
    <StyledTabWrapper>
      <StyledTab active={props.active} onClick={props.onClick}>
        {props.children}
      </StyledTab>
      <StyledClose onClick={props.onCloseClick} title="Close">
        ✗
      </StyledClose>
    </StyledTabWrapper>
  );
};

const StyledTabWrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const StyledTab = styled(Button)<{ active?: boolean }>`
  border-radius: 0;
  background-color: ${props =>
    props.active
      ? themeGet(`colors.${BgColor.White}`)(props)
      : themeGet(`colors.${BgColor.Control}`)(props)};
  ${props =>
    props.active &&
    css`
      border-bottom-color: ${themeGet(`colors.${BgColor.White}`)};
    `}
  padding-right: 30px;
`;

const StyledClose = styled(Button)`
  position: absolute;
  width: 20px;
  top: 5px;
  bottom: 5px;
  right: 5px;
  padding: 0;
  background: transparent;
  border: none;
`;

const StyledTabs = styled.div`
  display: flex;
  overflow: auto;
  position: relative;

  ${StyledTabWrapper}:not(:first-child) {
    margin-left: ${themeGet(`space.1`)}px;
  }
`;
