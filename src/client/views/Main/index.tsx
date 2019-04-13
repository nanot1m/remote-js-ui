import React, { useState } from "react";
import { Flex } from "@rebass/grid";

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
import { Card } from "client/components/Card";

export const Main: React.FC = () => {
  const [
    { npmScripts, stdoutTabs, currentStdoutTab },
    actions
  ] = useMainController();

  const [menuIsOpened, setMenuIsOpened] = useState(false);

  const npmScriptNames = Object.keys(npmScripts).sort();
  const currentScriptName = stdoutTabs[currentStdoutTab];
  const stdout = npmScripts[currentScriptName]
    ? npmScripts[currentScriptName].stdout
    : [];

  return (
    <Container>
      <S.Layout>
        <S.SideToggle
          type="checkbox"
          checked={menuIsOpened}
          onClick={() => setMenuIsOpened(!menuIsOpened)}
        />
        <S.Side>
          <Card>
            <H3>Npm Scripts</H3>
            <List>
              {npmScriptNames.map(name => {
                return (
                  <List.Item key={name}>
                    <NpmScript
                      state={npmScripts[name].state}
                      name={name}
                      onStart={name => {
                        actions.runNpmScript(name);
                        setMenuIsOpened(false);
                      }}
                      onKill={actions.killNpmScript}
                    />
                  </List.Item>
                );
              })}
            </List>
          </Card>
        </S.Side>
        <S.Main>
          <S.MainInner>
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
            <Stdout lines={stdout} />
          </S.MainInner>
        </S.Main>
      </S.Layout>
    </Container>
  );
};
