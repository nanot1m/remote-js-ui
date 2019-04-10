import { createAction, createStandardAction } from "typesafe-actions";
import { ProcessStateType, IProjectScripts } from "core";

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
  action => ({ npmScripts }: IProjectScripts) => {
    const npmScriptsDTO = Object.entries(npmScripts).map(([name, script]) => ({
      name,
      state: script.getState()
    }));
    return action({
      npmScripts: npmScriptsDTO
    });
  }
);

export const scriptStateChange = createStandardAction("scripts/STATE_CHANGE")<
  IScriptStateDTO
>();

export const scriptStdOutNewChunk = createStandardAction(
  "scripts/STD_OUT_NEW_CHUNK"
)<IScriptStdoutChunkDTO>();
