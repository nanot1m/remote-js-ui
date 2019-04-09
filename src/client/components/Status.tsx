import React from "react";
import styled from "styled-components";

import { Box } from "client/components/Box";
import { themeGet } from "styled-system";
import { TextColor } from "client/themes/constants";

enum StatusState {
  Stopped,
  Running
}

interface StatusProps {
  state: StatusState;
  title?: string;
}

export function Status({ state, title }: StatusProps) {
  return <StyledStatus bg={getBgColorByState(state)} title={title} />;
}

Status.State = StatusState;

function getBgColorByState(state: StatusState) {
  switch (state) {
    case StatusState.Stopped:
      return TextColor.Secondary;
    case StatusState.Running:
      return TextColor.Success;
  }
}

const StyledStatus = styled(Box)`
  width: 10px;
  height: 10px;
  border-radius: 100%;
  display: inline-block;
  margin-right: ${themeGet("space.2")}px;
`;
