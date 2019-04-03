import { createStandardAction, createAction } from "typesafe-actions";
import { ScriptStateType, IScript } from "../core";

export interface IScriptStateDTO {
  name: string;
  state: ScriptStateType;
}

export interface IScriptStdoutChunkDTO {
  name: string;
  chunk: string;
}

export const getScripts = createStandardAction("scripts/GET")();

export const runScript = createStandardAction("scripts/RUN")<string>();

export const killScript = createStandardAction("scripts/KILL")<string>();

export const sendScripts = createAction(
  "scripts/SEND",
  action => (scripts: Record<string, IScript>) => {
    const scriptDTOList = Object.values(scripts).map(script => ({
      name: script.name,
      state: script.getState()
    }));
    return action(scriptDTOList);
  }
);

export const scriptStateChange = createStandardAction("scripts/STATE_CHANGE")<
  IScriptStateDTO
>();

export const scriptStdOutNewChunk = createStandardAction(
  "scripts/STD_OUT_NEW_CHUNK"
)<IScriptStdoutChunkDTO>();

export type FromClientToServerActions =
  | ReturnType<typeof getScripts>
  | ReturnType<typeof runScript>
  | ReturnType<typeof killScript>;

export type FromServerToClientActions =
  | ReturnType<typeof scriptStateChange>
  | ReturnType<typeof sendScripts>
  | ReturnType<typeof scriptStdOutNewChunk>;
