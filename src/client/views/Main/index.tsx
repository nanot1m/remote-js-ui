import React from "react";
import { Flex, Box } from "@rebass/grid";
import { Card } from "client/components/Card";
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
      <Flex flexDirection={["column", "row"]} mt={5} mb={10}>
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
                      onStart={actions.runNpmScript}
                      onKill={actions.killNpmScript}
                    />
                  </List.Item>
                );
              })}
            </List>
          </Card>
        </S.Side>
        <S.Main>
          <Card>
            <H3>
              <Flex justifyContent="space-between" alignItems="center">
                <span>Stdout</span>
                <Button onClick={actions.clearStdout}>✗ Clear</Button>
              </Flex>
            </H3>
            <Tabs>
              {stdoutTabs.map((name, idx) => {
                const script = npmScripts[name];
                return (
                  <Tabs.Tab
                    key={name}
                    active={currentStdoutTab === idx}
                    onClick={() => actions.selectStdoutTab(idx)}
                  >
                    <Flex alignItems="baseline">
                      <Status
                        state={
                          script.state === "running"
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
          </Card>
        </S.Main>
      </Flex>
    </Container>
  );
};
