import React, { useMemo } from "react";
import { Flex, Box } from "@rebass/grid";

import { useMainController } from "client/views/Main/controller";
import { H3 } from "client/components/Heading";
import { Container } from "client/components/Container";
import { NpmScript } from "client/components/NpmScript";
import { List } from "client/components/List";
import { Stdout } from "client/components/Stdout";
import { Tabs } from "client/components/Tabs";
import { Button } from "client/components/Button";
import { Status } from "client/components/Status";

import * as S from "./styles";

export const Main: React.FC = () => {
  const [
    { npmScripts, stdoutTabs, currentStdoutTab },
    actions
  ] = useMainController();

  const npmScriptNames = Object.keys(npmScripts).sort();
  const currentScriptName = stdoutTabs[currentStdoutTab];
  const stdout = npmScripts[currentScriptName]
    ? npmScripts[currentScriptName].stdout
    : "";

  return (
    <Container>
      <S.Layout>
        <S.Side>
          <H3>Npm Scripts</H3>
          <List>
            {npmScriptNames.map(name => {
              return (
                <List.Item key={name}>
                  <NpmScript
                    state={npmScripts[name].state}
                    name={name}
                    onStart={actions.runNpmScript}
                    onKill={actions.killNpmScript}
                  />
                </List.Item>
              );
            })}
          </List>
        </S.Side>
        <S.Main>
          <H3>
            <Flex justifyContent="space-between" alignItems="center">
              <span>Stdout</span>
              <Button onClick={actions.clearStdout}>✗ Clear</Button>
            </Flex>
          </H3>
          <Tabs>
            {stdoutTabs.map((name, idx) => {
              const scriptIsRunning = npmScripts[name].state === "running";
              return (
                <Tabs.Tab
                  key={name}
                  active={currentStdoutTab === idx}
                  onClick={() => actions.selectStdoutTab(idx)}
                  onCloseClick={() => {
                    actions.closeStdoutTab(idx);
                    if (scriptIsRunning) {
                      actions.killNpmScript(name);
                    }
                  }}
                >
                  <Flex alignItems="baseline">
                    <Status
                      state={
                        scriptIsRunning
                          ? Status.State.Running
                          : Status.State.Stopped
                      }
                    />
                    <span>{name}</span>
                  </Flex>
                </Tabs.Tab>
              );
            })}
          </Tabs>
          <Stdout value={stdout} />
        </S.Main>
      </S.Layout>
    </Container>
  );
};
