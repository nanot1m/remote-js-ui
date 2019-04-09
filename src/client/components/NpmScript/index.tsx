import React, { useCallback } from "react";
import { ProcessStateType } from "core";
import { TextColor } from "client/themes/constants";
import { Button } from "client/components/Button";
import { Status } from "client/components/Status";

import * as S from "./styles";

interface NpmScriptProps {
  state: ProcessStateType;
  name: string;
  onStart(name: string): void;
  onKill?(name: string): void;
}

export const NpmScript: React.FC<NpmScriptProps> = ({
  name,
  state,
  onStart,
  onKill
}) => {
  const kill = useCallback(() => onKill && onKill(name), [name]);
  const start = useCallback(() => onStart(name), [name]);

  const scriptIsRunning = state === "running";
  const killButtonIsShown = scriptIsRunning && onKill;
  const runButtonIsShown = !scriptIsRunning;

  return (
    <S.Wrapper px={4} pt={2} pb={2}>
      <S.Header>
        <Status
          title={scriptIsRunning ? "Running" : "Stopped"}
          state={scriptIsRunning ? Status.State.Running : Status.State.Stopped}
        />
        <S.Name>{name}</S.Name>
      </S.Header>
      {killButtonIsShown && (
        <Button onClick={kill} color={TextColor.Error}>
          ︎●
        </Button>
      )}
      {runButtonIsShown && (
        <Button onClick={start} color={TextColor.Success}>
          ▶
        </Button>
      )}
    </S.Wrapper>
  );
};
