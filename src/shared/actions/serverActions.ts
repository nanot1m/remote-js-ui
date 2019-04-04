import { createAction, createStandardAction } from "typesafe-actions";
import { ProcessStateType, IProjectScripts } from "../../core";

export interface IScriptStateDTO {
  name: string;
  state: ProcessStateType;
}

export interface IScriptStdoutChunkDTO {
  name: string;
  chunk: string;
}

export const sendScripts = createAction(
  "scripts/SEND",
  action => ({ npmInstall, npmScripts }: IProjectScripts) => {
    const npmScriptsDTO = Object.entries(npmScripts).map(([name, script]) => ({
      name,
      state: script.getState()
    }));
    return action({
      npmScripts: npmScriptsDTO,
      npmInstall: npmInstall.getState()
    });
  }
);

export const scriptStateChange = createStandardAction("scripts/STATE_CHANGE")<
  IScriptStateDTO
>();

export const scriptStdOutNewChunk = createStandardAction(
  "scripts/STD_OUT_NEW_CHUNK"
)<IScriptStdoutChunkDTO>();

export const npmInstalState = createStandardAction("scripts/NPM_INSTALL_STATE")<
  ProcessStateType
>();

export const npmInstallStdoutChunk = createStandardAction(
  "scripts/NPM_INSTALL_STDOUT_CHUNK"
)<string>();
