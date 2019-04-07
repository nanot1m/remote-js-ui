import React from "react";
import { Card } from "client/components/Card";
import { useMainController } from "client/views/Main/controller";
import { H3 } from "client/components/Heading";
import { Container } from "client/components/Container";
import { NpmScript } from "client/components/NpmScript";
import { List } from "client/components/List";
import { Flex } from "@rebass/grid";
import { Stdout } from "client/components/Stdout";

import * as S from "./styles";
import { Button } from "client/components/Button";

export const Main: React.FC = () => {
  const [{ stdout, npmScripts, npmInstall }, actions] = useMainController();

  const npmScriptNames = Object.keys(npmScripts).sort();

  return (
    <Container>
      <Flex flexDirection={["column", "row"]} mt={5} mb={10}>
        <S.Side>
          <Card>
            <H3>Npm Scripts</H3>
            <List>
              <List.Item>
                <NpmScript
                  state={npmInstall}
                  name={"npm install"}
                  onStart={actions.runNpmInstall}
                />
              </List.Item>
              {npmScriptNames.map(name => {
                return (
                  <List.Item key={name}>
                    <NpmScript
                      state={npmScripts[name]}
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
            <Stdout value={stdout} />
          </Card>
        </S.Main>
      </Flex>
    </Container>
  );
};
