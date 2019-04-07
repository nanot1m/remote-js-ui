import { ProcessStateType } from "core";
import { FromServerToClientActions } from "shared/actions/FromServerToClientActions";
import { useCallback, useLayoutEffect, useReducer, useRef } from "react";
import { DispatchType, setupWS } from "client/ws";
import {
  getScripts,
  killScript,
  runNpmInstall as runNpmInstallAction,
  runScript
} from "shared/actions/clientActions";
import { createStandardAction } from "typesafe-actions";

export interface MainState {
  npmScripts: Record<string, ProcessStateType>;
  npmInstall: ProcessStateType;
  stdout: string;
}

const clearStdoutAction = createStandardAction("stdout/CLEAR")();

type ClientActions = ReturnType<typeof clearStdoutAction>;

const initialState: MainState = {
  npmScripts: {},
  npmInstall: "stopped",
  stdout: ""
};

function mainReducer(
  state: MainState,
  action: FromServerToClientActions | ClientActions
): MainState {
  switch (action.type) {
    case "scripts/NPM_INSTALL_STATE":
      return {
        ...state,
        npmInstall: action.payload
      };
    case "scripts/NPM_INSTALL_STDOUT_CHUNK": {
      return {
        ...state,
        stdout: state.stdout + `[npm install]: ${action.payload}\n`
      };
    }
    case "scripts/SEND": {
      return {
        ...state,
        npmScripts: action.payload.npmScripts,
        npmInstall: action.payload.npmInstall
      };
    }
    case "scripts/STATE_CHANGE": {
      return {
        ...state,
        npmScripts: {
          ...state.npmScripts,
          [action.payload.name]: action.payload.state
        }
      };
    }
    case "scripts/STD_OUT_NEW_CHUNK": {
      const { name, chunk } = action.payload;
      return {
        ...state,
        stdout: state.stdout + `[${name}]: ${chunk}\n`
      };
    }
    case "stdout/CLEAR": {
      return {
        ...state,
        stdout: ""
      };
    }
    default:
      return state;
  }
}

export function useMainController() {
  const wsDispatch = useRef<DispatchType>(() => void 0);
  const [state, dispatch] = useReducer(mainReducer, initialState);

  useLayoutEffect(() => {
    const ws = setupWS(action => dispatch(action));
    ws.dispatch(getScripts());
    wsDispatch.current = ws.dispatch;
  }, []);

  const killNpmScript = useCallback(
    (name: string) => wsDispatch.current(killScript(name)),
    []
  );

  const runNpmScript = useCallback(
    (name: string) => wsDispatch.current(runScript(name)),
    []
  );

  const runNpmInstall = useCallback(
    () => wsDispatch.current(runNpmInstallAction()),
    []
  );

  const clearStdout = useCallback(() => dispatch(clearStdoutAction()), []);

  return [
    state,
    { killNpmScript, runNpmScript, runNpmInstall, clearStdout }
  ] as const;
}
